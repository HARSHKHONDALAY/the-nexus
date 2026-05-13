"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
type EventData = any;
import TierCard from "@/components/sections/event-detail/registration/tier-card";

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-lime-100/48">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-lime-200/12 bg-black/35 px-4 py-3 text-sm normal-case tracking-normal text-lime-50 outline-none"
      />
    </label>
  );
}

type BackendEvent = { id: string; title: string };
type BackendTier = { id: string; name: string; pricePaise: number; currency: string; capacity: number; soldCount: number; reservedCount: number; active: boolean };
type Booking = { id: string; bookingReference: string; status: string; amountPaise: number; currency: string; tickets: Ticket[] };
type Ticket = { id: string; ticketCode: string; qrToken?: string | null };
type PaymentOrder = { providerOrderId: string; amountPaise: number; currency: string; razorpayKeyId: string };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RegisterFormProps {
  event: EventData;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? "Request failed.");
  return body.data as T;
}

function loadRazorpay() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export default function RegisterForm({ event }: RegisterFormProps) {
  const [tierId, setTierId] = useState(event.ticketTiers[0]?.id ?? "");
  const [backendEvent, setBackendEvent] = useState<BackendEvent | null>(null);
  const [backendTiers, setBackendTiers] = useState<BackendTier[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "submitting" | "paid" | "failed">("loading");
  const [message, setMessage] = useState("Loading live ticket inventory.");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    attendeeName: "",
    attendeeEmail: "",
    attendeePhone: "",
    instagramId: "",
    attendeeAge: "",
    attendeeLocation: "",
    occupation: "",
    quantity: 1,
  });

  const selectedTier = useMemo(
    () => event.ticketTiers.find((tier: any) => tier.id === tierId),
    [event.ticketTiers, tierId],
  );

  const selectedBackendTier = useMemo(() => {
    if (!selectedTier) return backendTiers[0];
    return backendTiers.find((tier) => tier.name.toLowerCase() === selectedTier.name.toLowerCase()) ?? backendTiers[0];
  }, [backendTiers, selectedTier]);

  useEffect(() => {
    let alive = true;
    api<{ event: BackendEvent; ticketTiers: BackendTier[] }>(`/api/public/events/${event.slug}`)
      .then((payload) => {
        if (!alive) return;
        setBackendEvent(payload.event);
        setBackendTiers(payload.ticketTiers.filter((tier) => tier.active && tier.capacity > tier.soldCount + tier.reservedCount));
        setStatus("ready");
        setMessage("Live booking is available.");
      })
      .catch((error) => {
        if (!alive) return;
        setStatus("failed");
        setMessage(error instanceof Error ? error.message : "This event is not available for booking.");
      });
    return () => {
      alive = false;
    };
  }, [event.slug]);

  async function submitBooking(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    if (!backendEvent || !selectedBackendTier) {
      setStatus("failed");
      setMessage("Live ticket inventory is unavailable.");
      return;
    }
    setStatus("submitting");
    setMessage("Creating a secure booking hold.");
    try {
      const booking = await api<Booking>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventId: backendEvent.id,
          ticketTierId: selectedBackendTier.id,
          attendeeName: form.attendeeName,
          attendeeEmail: form.attendeeEmail,
          attendeePhone: form.attendeePhone,
          instagramId: form.instagramId || null,
          attendeeAge: form.attendeeAge ? Number(form.attendeeAge) : null,
          attendeeLocation: form.attendeeLocation || null,
          occupation: form.occupation || null,
          sourceType: "website",
          quantity: form.quantity,
        }),
      });

      setMessage("Opening Razorpay checkout.");
      const order = await api<PaymentOrder>("/api/payments/razorpay/orders", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking.id }),
      });

      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay checkout did not initialize.");

      await new Promise<void>((resolve, reject) => {
        const checkout = new window.Razorpay!({
          key: order.razorpayKeyId,
          amount: order.amountPaise,
          currency: order.currency,
          name: "The Nexus",
          description: event.title,
          order_id: order.providerOrderId,
          prefill: { name: form.attendeeName, email: form.attendeeEmail, contact: form.attendeePhone },
          modal: { ondismiss: () => reject(new Error("Payment was cancelled before completion.")) },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              setMessage("Verifying payment with the backend.");
              const verified = await api<Booking>("/api/payments/razorpay/verify", {
                method: "POST",
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              setConfirmedBooking(verified);
              setStatus("paid");
              setMessage("Payment confirmed. Your QR ticket is ready below and queued for email delivery.");
              resolve();
            } catch (error) {
              reject(error);
            }
          },
        });
        checkout.open();
      });
    } catch (error) {
      setStatus("failed");
      setMessage(error instanceof Error ? error.message : "Booking could not be completed.");
    }
  }

  return (
    <SectionWrapper spacing="default" className="border-y border-lime-200/15 bg-black/45" blendTop blendBottom>
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <div className="grid gap-4">
            {event.ticketTiers.map((tier: any) => (
              <TierCard key={tier.id} tier={tier} selected={tier.id === tierId} onSelect={() => setTierId(tier.id)} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-[2rem] border border-lime-200/16 bg-lime-200/[0.04] p-7 md:col-span-6 md:p-9"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-lime-100/50">Secure checkout</p>
          <p className="mt-3 text-sm text-lime-100/65">
            Selected tier: <span className="text-lime-50">{selectedTier?.name}</span>
          </p>

          <form onSubmit={submitBooking} className="mt-6 grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Name" value={form.attendeeName} onChange={(attendeeName) => setForm((current) => ({ ...current, attendeeName }))} />
              <Input label="Email" type="email" value={form.attendeeEmail} onChange={(attendeeEmail) => setForm((current) => ({ ...current, attendeeEmail }))} />
              <Input label="Phone" value={form.attendeePhone} onChange={(attendeePhone) => setForm((current) => ({ ...current, attendeePhone }))} />
              <Input label="Instagram" required={false} value={form.instagramId} onChange={(instagramId) => setForm((current) => ({ ...current, instagramId }))} />
              <Input label="Age" type="number" required={false} value={form.attendeeAge} onChange={(attendeeAge) => setForm((current) => ({ ...current, attendeeAge }))} />
              <Input label="City" required={false} value={form.attendeeLocation} onChange={(attendeeLocation) => setForm((current) => ({ ...current, attendeeLocation }))} />
              <Input label="Occupation" required={false} value={form.occupation} onChange={(occupation) => setForm((current) => ({ ...current, occupation }))} />
              <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-lime-100/48">
                Quantity
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={form.quantity}
                  onChange={(inputEvent) => setForm((current) => ({ ...current, quantity: Number(inputEvent.target.value) }))}
                  className="rounded-2xl border border-lime-200/12 bg-black/35 px-4 py-3 text-sm normal-case tracking-normal text-lime-50 outline-none"
                />
              </label>
            </div>

            <p className="rounded-3xl border border-lime-200/12 bg-black/24 p-4 text-sm leading-6 text-lime-100/70" aria-live="polite">
              {message}
            </p>

            {confirmedBooking?.tickets?.length ? (
              <div className="grid gap-3 rounded-3xl border border-lime-200/12 bg-black/24 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-lime-100/48">Confirmed tickets</p>
                {confirmedBooking.tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-2xl border border-lime-200/10 p-4 text-sm text-lime-50">
                    <p>{ticket.ticketCode}</p>
                    <p className="mt-2 break-all text-lime-100/58">{ticket.qrToken}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.24em] text-lime-100/46">
                {selectedBackendTier ? `${selectedBackendTier.capacity - selectedBackendTier.soldCount - selectedBackendTier.reservedCount} live spots available` : "Waiting for live inventory"}
              </p>
              <Magnetic className="inline-block" strength={0.14}>
                <Button type="submit" variant="primary" size="roomy" disabled={status === "loading" || status === "submitting" || !selectedBackendTier}>
                  {status === "submitting" ? "Processing" : "Pay Securely"}
                </Button>
              </Magnetic>
            </div>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

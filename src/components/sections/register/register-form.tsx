"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import type { EventData } from "@/lib/types/api";
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

import { getApiBaseUrl } from "@/lib/config/api";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`;
  console.log(`🌐 Browser API request to: ${fullUrl}`);
  
  const response = await fetch(fullUrl, {
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
    privacyConsent: false,
    mediaConsent: false,
  });

  const selectedTier = useMemo(
    () => backendTiers.find((tier: BackendTier) => tier.id === tierId),
    [backendTiers, tierId],
  );

  const selectedBackendTier = selectedTier;

  useEffect(() => {
    let alive = true;
    api<{ event: BackendEvent; ticketTiers: BackendTier[] }>(`/api/events/public/events/${event.slug}`)
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
        // Show more detailed error information
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Event loading error:", error);
        setMessage(`Failed to load event data: ${errorMessage}`);
      });
    return () => {
      alive = false;
    };
  }, [event.slug]);

  async function submitBooking(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    
    // Validate required fields and consent
    if (!form.attendeeName || !form.attendeeEmail || !form.attendeePhone || !form.attendeeAge) {
      setStatus("failed");
      setMessage("Please fill in all required fields.");
      return;
    }
    
    if (!form.privacyConsent || !form.mediaConsent) {
      setStatus("failed");
      setMessage("Please accept both consent checkboxes to continue.");
      return;
    }
    
    if (!backendEvent || !selectedBackendTier) {
      setStatus("failed");
      setMessage("Live ticket inventory is unavailable.");
      return;
    }
    
    setStatus("submitting");
    setMessage("Creating a secure booking hold.");
    try {
      const booking = await api<Booking>("/api/public/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventId: backendEvent.id,
          ticketTierId: selectedBackendTier.id,
          attendeeName: form.attendeeName,
          attendeeEmail: form.attendeeEmail,
          attendeePhone: form.attendeePhone,
          instagramId: form.instagramId || null,
          attendeeAge: form.attendeeAge ? Number(form.attendeeAge) : null,
          sourceType: "website",
          quantity: 1, // Always 1 ticket per registration
          privacyConsent: form.privacyConsent,
          mediaConsent: form.mediaConsent,
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
      const errorMessage = error instanceof Error ? error.message : "Booking could not be completed.";
      console.error("Booking submission error:", error);
      setMessage(`Booking failed: ${errorMessage}`);
    }
  }

  return (
    <SectionWrapper spacing="default" className="border-y border-lime-200/15 bg-black/45" blendTop blendBottom>
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <div className="grid gap-4">
            {backendTiers.map((tier: BackendTier) => (
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
            Selected tier: <span className="text-lime-50">{selectedTier?.name}</span> - <span className="text-lime-50">₹{selectedBackendTier ? (selectedBackendTier.pricePaise / 100).toFixed(2) : '0.00'}</span>
          </p>

          <form onSubmit={submitBooking} className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={form.attendeeName} onChange={(attendeeName) => setForm((current) => ({ ...current, attendeeName }))} />
              <Input label="Email" type="email" value={form.attendeeEmail} onChange={(attendeeEmail) => setForm((current) => ({ ...current, attendeeEmail }))} />
              <Input label="Phone" value={form.attendeePhone} onChange={(attendeePhone) => setForm((current) => ({ ...current, attendeePhone }))} />
              <Input label="Age" type="number" value={form.attendeeAge} onChange={(attendeeAge) => setForm((current) => ({ ...current, attendeeAge }))} />
              <div className="md:col-span-2">
                <Input 
                  label="Instagram (Optional)" 
                  required={false} 
                  value={form.instagramId} 
                  onChange={(instagramId) => setForm((current) => ({ ...current, instagramId }))} 
                />
                <p className="mt-1 text-xs text-lime-100/40">Used for tagging/re-sharing event moments.</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-lime-200/10 pt-6">
              <h4 className="text-sm font-medium text-lime-50">Consent & Agreement</h4>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.privacyConsent}
                  onChange={(e) => setForm((current) => ({ ...current, privacyConsent: e.target.checked }))}
                  className="mt-1 rounded border-lime-200/20 bg-black/30 text-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:ring-offset-0"
                  required
                />
                <span className="text-sm text-lime-100/70 leading-relaxed">
                  I agree to The Nexus privacy policy and terms.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.mediaConsent}
                  onChange={(e) => setForm((current) => ({ ...current, mediaConsent: e.target.checked }))}
                  className="mt-1 rounded border-lime-200/20 bg-black/30 text-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:ring-offset-0"
                  required
                />
                <span className="text-sm text-lime-100/70 leading-relaxed">
                  I understand this event may be photographed/filmed and I consent to being included in event media.
                </span>
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

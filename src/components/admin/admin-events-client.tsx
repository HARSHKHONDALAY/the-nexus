"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminButton, AdminCard, AdminHeader, EmptyState, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type AdminEvent, formatDateTime, formatMoney } from "@/lib/admin/operations";

type Tab = "current" | "past" | "create";

const initialForm = {
  title: "",
  eventType: "Chess Nexus",
  startsAt: "",
  endsAt: "",
  venueName: "",
  venueAddress: "",
  city: "Mumbai",
  ticketPrice: "600",
  venueCost: "0",
  maxCapacity: "80",
  description: "",
  registrationOpen: true,
  publish: false,
  allowWalkIns: true,
  visibility: "PUBLIC",
  seoTitle: "",
  seoDescription: "",
  posterImage: null as File | null,
};

export default function AdminEventsClient() {
  const [tab, setTab] = useState<Tab>("current");
  const [current, setCurrent] = useState<AdminEvent[]>([]);
  const [past, setPast] = useState<AdminEvent[]>([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedTabs, setLoadedTabs] = useState<Record<Exclude<Tab, "create">, boolean>>({
    current: false,
    past: false,
  });

  const loadCurrent = async () => {
    try {
      const currentEvents = await adminApi<AdminEvent[]>("/events/current");
      setCurrent(currentEvents);
      setLoadedTabs((state) => ({ ...state, current: true }));
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to load events."));
    }
  };

  const loadPast = async () => {
    try {
      const pastEvents = await adminApi<AdminEvent[]>("/events/past");
      setPast(pastEvents);
      setLoadedTabs((state) => ({ ...state, past: true }));
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to load past events."));
    }
  };

  const load = async (nextTab: Exclude<Tab, "create"> = "current") => {
    setLoading(true);
    try {
      if (nextTab === "current") {
        await loadCurrent();
      } else {
        await loadPast();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    async function loadInitial() {
      setLoading(true);
      try {
        const currentEvents = await adminApi<AdminEvent[]>("/events/current");
        if (!alive) return;
        setCurrent(currentEvents);
        setLoadedTabs((state) => ({ ...state, current: true }));
      } catch (reason) {
        if (alive) setMessage(formatAdminError(reason, "Unable to load events."));
      } finally {
        if (alive) setLoading(false);
      }
    }
    void loadInitial();
    return () => {
      alive = false;
    };
  }, []);

  async function mutateEvent(eventId: string, action: string) {
    setMessage("");
    try {
      await adminApi<AdminEvent>(`/events/${eventId}/status`, { method: "PATCH", body: JSON.stringify({ action }) });
      await load("current");
      if (loadedTabs.past) {
        await loadPast();
      }
    } catch (reason) {
      setMessage(formatAdminError(reason, "Event action failed."));
    }
  }

  async function duplicate(eventId: string) {
    setMessage("");
    try {
      await adminApi<AdminEvent>(`/events/${eventId}/duplicate`, { method: "POST" });
      await load("current");
      if (loadedTabs.past) {
        await loadPast();
      }
    } catch (reason) {
      setMessage(formatAdminError(reason, "Duplicate failed."));
    }
  }

  async function deleteEvent(eventId: string) {
    setMessage("");
    try {
      await adminApi(`/events/${eventId}`, { method: "DELETE" });
      await load("current");
      if (loadedTabs.past) {
        await loadPast();
      }
    } catch (reason) {
      setMessage(formatAdminError(reason, "Delete failed."));
    }
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const formData = new FormData();
      
      // Add all form fields as JSON
      const eventData = {
        title: form.title,
        eventType: form.eventType,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        venueName: form.venueName,
        venueAddress: form.venueAddress,
        city: form.city,
        ticketPricePaise: Math.round(Number(form.ticketPrice) * 100),
        venueCostPaise: Math.round(Number(form.venueCost) * 100),
        maxCapacity: Number(form.maxCapacity),
        description: form.description,
        registrationOpen: form.registrationOpen,
        publish: form.publish,
        allowWalkIns: form.allowWalkIns,
        visibility: form.visibility,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
      };
      
      formData.append('eventData', JSON.stringify(eventData));
      
      // Add poster image if selected
      if (form.posterImage) {
        formData.append('posterImage', form.posterImage);
      }
      
      await adminApi<AdminEvent>("/events", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });
      setForm(initialForm);
      setTab("current");
      await load("current");
    } catch (reason) {
      setMessage(formatAdminError(reason, "Create event failed."));
    }
  }

  const events = tab === "past" ? past : current;

  async function switchTab(nextTab: Tab) {
    setTab(nextTab);
    setMessage("");

    if (nextTab === "create") return;
    if (!loadedTabs[nextTab]) {
      await load(nextTab);
    }
  }

  return (
    <>
      <AdminHeader eyebrow="Live Event Control" title="Events that actually operate." description="Current events, past events, and real creation workflows backed by the Spring operations API." action={<AdminButton onClick={() => setTab("create")}>Create Event</AdminButton>} />
      <div className="mb-5 flex flex-wrap gap-3">
        {(["current", "past", "create"] as Tab[]).map((item) => (
          <AdminButton key={item} variant={tab === item ? "primary" : "ghost"} onClick={() => void switchTab(item)}>
            {item === "current" ? "Current Events" : item === "past" ? "Past Events" : "Create Event"}
          </AdminButton>
        ))}
      </div>
      {message ? <AdminCard className="mb-5 text-amber-100">{message}</AdminCard> : null}

      {tab === "create" ? (
        <AdminCard>
          <form onSubmit={create} className="grid gap-5 lg:grid-cols-2">
            <Field label="Event Title" value={form.title} onChange={(title) => setForm({ ...form, title })} required />
            <Select label="Event Type" value={form.eventType} onChange={(eventType) => setForm({ ...form, eventType })} options={["Chess Nexus", "Art Nexus"]} />
            <Field label="Start Time" type="datetime-local" value={form.startsAt} onChange={(startsAt) => setForm({ ...form, startsAt })} required />
            <Field label="End Time" type="datetime-local" value={form.endsAt} onChange={(endsAt) => setForm({ ...form, endsAt })} required />
            <Field label="Venue Name" value={form.venueName} onChange={(venueName) => setForm({ ...form, venueName })} required />
            <Field label="Venue Address" value={form.venueAddress} onChange={(venueAddress) => setForm({ ...form, venueAddress })} />
            <Field label="Ticket Price INR" type="number" value={form.ticketPrice} onChange={(ticketPrice) => setForm({ ...form, ticketPrice })} required />
            <Field label="Venue Cost INR" type="number" value={form.venueCost} onChange={(venueCost) => setForm({ ...form, venueCost })} />
            <Field label="Max Capacity" type="number" value={form.maxCapacity} onChange={(maxCapacity) => setForm({ ...form, maxCapacity })} required />
            <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} required />
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-lime-100/50">Description</span>
              <textarea required rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-2xl border border-lime-200/14 bg-black/30 px-4 py-3 text-lime-50 outline-none" />
            </label>
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-lime-100/50">Event Poster (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setForm({ ...form, posterImage: event.target.files?.[0] || null })}
                className="rounded-2xl border border-lime-200/14 bg-black/30 px-4 py-3 text-lime-50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-lime-200/20 file:text-lime-50 hover:file:bg-lime-200/30"
              />
              {form.posterImage && (
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-lime-100/70">Selected: {form.posterImage.name}</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, posterImage: null })}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              )}
            </label>
            <Field label="SEO Title" value={form.seoTitle} onChange={(seoTitle) => setForm({ ...form, seoTitle })} />
            <Field label="SEO Description" value={form.seoDescription} onChange={(seoDescription) => setForm({ ...form, seoDescription })} />
            <Toggle label="Open registrations" checked={form.registrationOpen} onChange={(registrationOpen) => setForm({ ...form, registrationOpen })} />
            <Toggle label="Allow walk-ins" checked={form.allowWalkIns} onChange={(allowWalkIns) => setForm({ ...form, allowWalkIns })} />
            <Toggle label="Publish immediately" checked={form.publish} onChange={(publish) => setForm({ ...form, publish })} />
            <div className="lg:col-span-2"><AdminButton type="submit">Create Real Event</AdminButton></div>
          </form>
        </AdminCard>
      ) : loading ? <EmptyState title="Loading events." detail="Reading current database state." /> : events.length === 0 ? (
        <EmptyState title={tab === "current" ? "No current events." : "No past events."} detail="The admin starts empty. Create the first operational event when ready." />
      ) : (
        <section className="grid gap-5">
          {events.map((event) => (
            <AdminCard key={event.id}>
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusChip tone={event.status === "LIVE" ? "lime" : event.status === "CLOSED" ? "neutral" : "blue"}>{event.status}</StatusChip>
                    <StatusChip tone={event.registrationOpen ? "lime" : "red"}>{event.registrationOpen ? "Registration Open" : "Registration Closed"}</StatusChip>
                    <StatusChip tone="neutral">{event.world}</StatusChip>
                  </div>
                  <h3 className="mt-5 font-serif text-4xl tracking-[-0.04em] text-lime-50">{event.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-lime-100/58">{formatDateTime(event.startsAt)} · {event.venueName}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-4">
                    <span className="rounded-2xl bg-lime-200/[0.045] p-4 text-sm text-lime-100/70">{formatMoney(event.ticketPricePaise)} ticket</span>
                    <span className="rounded-2xl bg-lime-200/[0.045] p-4 text-sm text-lime-100/70">{event.capacity} seats</span>
                    <span className="rounded-2xl bg-lime-200/[0.045] p-4 text-sm text-lime-100/70">{event.registrations} registrations</span>
                    <span className="rounded-2xl bg-lime-200/[0.045] p-4 text-sm text-lime-100/70">{event.checkedIn} checked in</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-lime-200/10 bg-black/24 p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-lime-100/42">Quick Operations</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <AdminButton variant="ghost" onClick={() => mutateEvent(event.id, event.registrationOpen ? "close_registrations" : "open_registrations")}>{event.registrationOpen ? "Close" : "Open"}</AdminButton>
                    <AdminButton variant="ghost" onClick={() => mutateEvent(event.id, "mark_live")}>Mark Live</AdminButton>
                    <AdminButton variant="ghost" onClick={() => mutateEvent(event.id, "move_to_past")}>Move Past</AdminButton>
                    <AdminButton variant="ghost" onClick={() => duplicate(event.id)}>Duplicate</AdminButton>
                    <AdminButton 
                      variant="ghost" 
                      className="col-span-2 border-red-500/30 text-red-400 hover:bg-red-500/10" 
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete Event
                    </AdminButton>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </section>
      )}
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.22em] text-lime-100/50">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.22em] text-lime-100/50">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-lime-200/12 bg-black/24 p-4 text-sm text-lime-100/64">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

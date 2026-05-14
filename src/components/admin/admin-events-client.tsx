"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminButton, AdminCard, AdminHeader, EmptyState, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type AdminEvent, formatDateTime, formatMoney } from "@/lib/admin/operations";

type Tab = "current" | "past" | "create";

const initialForm = {
  title: "",
  eventType: "Chess Nexus",
  starts_at: "",
  ends_at: "",
  venue_name: "",
  venue_address: "",
  city: "Mumbai",
  ticketPrice: "600",
  venueCost: "0",
  maxCapacity: "80",
  description: "",
  registration_open: true,
  publish: false,
  allow_walk_ins: true,
  visibility: "PUBLIC",
  seo_title: "",
  seo_description: "",
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
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

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
      // Find the event in current events
      const event = current.find(e => e.id === eventId);
      
      // Map frontend actions to backend action values
      let backendAction: string;
      switch (action) {
        case "mark_live":
          backendAction = "MARK_LIVE";
          break;
        case "move_to_past":
          backendAction = "MOVE_PAST";
          break;
        case "close_registrations":
          backendAction = "CLOSE_REGISTRATIONS";
          break;
        case "open_registrations":
          backendAction = "OPEN_REGISTRATIONS";
          // Show event details when opening registrations
          if (event) {
            setSelectedEvent(event);
          }
          break;
        default:
          backendAction = "OPEN";
      }
      
      await adminApi<AdminEvent>(`/events/${eventId}/status`, { method: "PATCH", body: JSON.stringify({ action: backendAction }) });
      await load("current");
      if (loadedTabs.past) {
        await loadPast();
      }
    } catch (reason) {
      setMessage(formatAdminError(reason, "Event action failed."));
    }
  }

  async function showEventDetails(eventId: string) {
    const event = current.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
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
      // Ensure startsAt is valid
      let startDate = new Date(form.starts_at);
      if (!form.starts_at || !isFinite(startDate.getTime())) {
        // If no valid start date, use current time
        startDate = new Date();
      }
      
      // Auto-generate endsAt (startsAt + 4 hours)
      const endDate = new Date(startDate.getTime() + (4 * 60 * 60 * 1000));
      
      const eventData = {
        title: form.title,
        eventType: form.eventType,
        startsAt: startDate.toISOString(),
        endsAt: endDate.toISOString(),
        venueName: form.venue_name || "TBD Venue",
        venue_address: form.venue_address,
        city: form.city,
        ticketPricePaise: Math.round(Number(form.ticketPrice) * 100),
        venueCostPaise: Math.round(Number(form.venueCost) * 100),
        maxCapacity: Number(form.maxCapacity),
        description: form.description,
        registration_open: form.registration_open,
        publish: form.publish,
        allow_walk_ins: form.allow_walk_ins,
        visibility: form.visibility,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
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
            <Field label="Start Time" type="datetime-local" value={form.starts_at} onChange={(starts_at) => setForm({ ...form, starts_at })} required />
            <Field label="End Time" type="datetime-local" value={form.ends_at} onChange={(ends_at) => setForm({ ...form, ends_at })} required />
            <Field label="Venue Name" value={form.venue_name} onChange={(venue_name) => setForm({ ...form, venue_name })} required />
            <Field label="Venue Address" value={form.venue_address} onChange={(venue_address) => setForm({ ...form, venue_address })} />
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
            <Field label="SEO Title" value={form.seo_title} onChange={(seo_title) => setForm({ ...form, seo_title })} />
            <Field label="SEO Description" value={form.seo_description} onChange={(seo_description) => setForm({ ...form, seo_description })} />
            <Toggle label="Open registrations" checked={form.registration_open} onChange={(registration_open) => setForm({ ...form, registration_open })} />
            <Toggle label="Allow walk-ins" checked={form.allow_walk_ins} onChange={(allow_walk_ins) => setForm({ ...form, allow_walk_ins })} />
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
                    <StatusChip tone={event.registration_open ? "lime" : "red"}>{event.registration_open ? "Registration Open" : "Registration Closed"}</StatusChip>
                    <StatusChip tone="neutral">{event.world}</StatusChip>
                  </div>
                  <h3 className="mt-5 font-serif text-4xl tracking-[-0.04em] text-lime-50">{event.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-lime-100/58">{formatDateTime(event.starts_at)} · {event.venue_name}</p>
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
                    <AdminButton variant="ghost" onClick={() => mutateEvent(event.id, event.registration_open ? "close_registrations" : "open_registrations")}>{event.registration_open ? "Close" : "Open"}</AdminButton>
                    <AdminButton variant="ghost" onClick={() => showEventDetails(event.id)}>View Details</AdminButton>
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-lime-200/20 bg-black/90 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-lime-50">Event Details & Registration</h2>
              <AdminButton variant="ghost" onClick={() => setSelectedEvent(null)}>Close</AdminButton>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Event Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-lime-50 mb-2">{selectedEvent.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <StatusChip tone={selectedEvent.status === "LIVE" ? "lime" : selectedEvent.status === "CLOSED" ? "neutral" : "blue"}>{selectedEvent.status}</StatusChip>
                    <StatusChip tone={selectedEvent.registration_open ? "lime" : "red"}>{selectedEvent.registration_open ? "Registration Open" : "Registration Closed"}</StatusChip>
                    <StatusChip tone="neutral">{selectedEvent.world}</StatusChip>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Date & Time</p>
                    <p className="text-lime-50">{formatDateTime(selectedEvent.starts_at)}</p>
                  </div>
                  
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Venue</p>
                    <p className="text-lime-50">{selectedEvent.venue_name}</p>
                    {selectedEvent.venue_address && <p className="text-sm text-lime-100/70">{selectedEvent.venue_address}</p>}
                  </div>
                  
                                  </div>
              </div>
              
              {/* Registration Statistics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-lime-50">Registration Statistics</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Ticket Price</p>
                    <p className="text-lg font-bold text-lime-50">{formatMoney(selectedEvent.ticketPricePaise)}</p>
                  </div>
                  
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Capacity</p>
                    <p className="text-lg font-bold text-lime-50">{selectedEvent.capacity}</p>
                  </div>
                  
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Registrations</p>
                    <p className="text-lg font-bold text-lime-50">{selectedEvent.registrations}</p>
                  </div>
                  
                  <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Checked In</p>
                    <p className="text-lg font-bold text-lime-50">{selectedEvent.checkedIn}</p>
                  </div>
                </div>
                
                <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Revenue</p>
                  <p className="text-lg font-bold text-lime-50">{formatMoney(selectedEvent.registrations * selectedEvent.ticketPricePaise)}</p>
                  <p className="text-sm text-lime-100/70 mt-1">From {selectedEvent.registrations} registrations</p>
                </div>
                
                <div className="rounded-xl border border-lime-200/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-lime-100/50 mb-1">Occupancy Rate</p>
                  <p className="text-lg font-bold text-lime-50">
                    {selectedEvent.capacity > 0 ? Math.round((selectedEvent.registrations / selectedEvent.capacity) * 100) : 0}%
                  </p>
                  <p className="text-sm text-lime-100/70 mt-1">{selectedEvent.registrations} of {selectedEvent.capacity} seats filled</p>
                </div>
              </div>
            </div>
            
            {/* Registration Actions */}
            <div className="mt-6 pt-6 border-t border-lime-200/10">
              <h4 className="text-lg font-semibold text-lime-50 mb-4">Registration Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AdminButton 
                  onClick={() => {
                    mutateEvent(selectedEvent.id, selectedEvent.registration_open ? "close_registrations" : "open_registrations");
                    setSelectedEvent(null);
                  }}
                  variant={selectedEvent.registration_open ? "ghost" : "primary"}
                >
                  {selectedEvent.registration_open ? "Close Registrations" : "Open Registrations"}
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => window.open(`/events/${selectedEvent.slug}`, '_blank')}>View Public Page</AdminButton>
                <AdminButton variant="ghost" onClick={() => window.open(`/register/${selectedEvent.slug}`, '_blank')}>View Registration</AdminButton>
                <AdminButton variant="ghost" onClick={() => setSelectedEvent(null)}>Close Details</AdminButton>
              </div>
            </div>
          </div>
        </div>
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

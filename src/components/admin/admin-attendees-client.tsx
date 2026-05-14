"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminButton, AdminCard, AdminHeader, AdminToolbar, EmptyState, PremiumTable, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type AdminEvent, type Attendee, formatDateTime, formatMoney } from "@/lib/admin/operations";

const walkInInitial = { name: "", email: "", phone: "", instagram: "", age: "", paymentMethod: "UPI", amountPaid: "", source: "walk_in", notes: "", checkedIn: true, privacyConsent: false, mediaConsent: false };

export default function AdminAttendeesClient() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [walkIn, setWalkIn] = useState(walkInInitial);
  const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(new Set());

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const loadEvents = async () => {
    const data = await adminApi<AdminEvent[]>("/events/current");
    setEvents(data);
    setSelectedEventId((current) => current || data[0]?.id || "");
  };

  const loadAttendees = async (eventId = selectedEventId, search = query) => {
    if (!eventId) return setAttendees([]);
    const data = await adminApi<Attendee[]>(`/events/${eventId}/attendees?query=${encodeURIComponent(search)}`);
    setAttendees(data);
  };

  useEffect(() => {
    let alive = true;
    async function loadInitialEvents() {
      try {
        const data = await adminApi<AdminEvent[]>("/events/current");
        if (!alive) return;
        setEvents(data);
        setSelectedEventId(data[0]?.id || "");
      } catch (reason) {
        if (alive) setMessage(formatAdminError(reason, "Unable to load events."));
      }
    }
    void loadInitialEvents();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }
    let alive = true;
    async function loadSelectedAttendees() {
      try {
        const data = await adminApi<Attendee[]>(`/events/${selectedEventId}/attendees?query=${encodeURIComponent(query)}`);
        if (alive) setAttendees(data);
      } catch (reason) {
        if (alive) setMessage(formatAdminError(reason, "Unable to load attendees."));
      }
    }
    void loadSelectedAttendees();
    return () => {
      alive = false;
    };
  }, [selectedEventId, query]);

  async function checkIn(attendee: Attendee) {
    if (!attendee.ticketId) return;
    try {
      await adminApi<Attendee>(`/tickets/${attendee.ticketId}/check-in`, { method: "POST" });
      await loadAttendees();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to check in attendee."));
    }
  }

  async function undo(attendee: Attendee) {
    if (!attendee.ticketId) return;
    try {
      await adminApi<Attendee>(`/tickets/${attendee.ticketId}/undo-check-in`, { method: "POST" });
      await loadAttendees();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to undo check-in."));
    }
  }

  async function remove(attendee: Attendee) {
    try {
      await adminApi<void>(`/attendees/${attendee.bookingId}`, { method: "DELETE" });
      await loadAttendees();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to delete attendee."));
    }
  }

  async function bulkCheckIn() {
    if (selectedAttendees.size === 0) return;
    try {
      const promises = Array.from(selectedAttendees).map(bookingId => 
        adminApi<Attendee>(`/attendees/${bookingId}/check-in`, { method: "POST" })
      );
      await Promise.all(promises);
      setSelectedAttendees(new Set());
      await loadAttendees();
      setMessage(`Checked in ${selectedAttendees.size} attendees`);
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to check in selected attendees."));
    }
  }

  async function bulkUndoCheckIn() {
    if (selectedAttendees.size === 0) return;
    try {
      const promises = Array.from(selectedAttendees).map(bookingId => 
        adminApi<Attendee>(`/attendees/${bookingId}/undo-check-in`, { method: "POST" })
      );
      await Promise.all(promises);
      setSelectedAttendees(new Set());
      await loadAttendees();
      setMessage(`Undid check-in for ${selectedAttendees.size} attendees`);
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to undo check-in for selected attendees."));
    }
  }

  async function bulkDelete() {
    if (selectedAttendees.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedAttendees.size} attendees? This action cannot be undone.`)) return;
    try {
      const promises = Array.from(selectedAttendees).map(bookingId => 
        adminApi<void>(`/attendees/${bookingId}`, { method: "DELETE" })
      );
      await Promise.all(promises);
      setSelectedAttendees(new Set());
      await loadAttendees();
      setMessage(`Deleted ${selectedAttendees.size} attendees`);
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to delete selected attendees."));
    }
  }

  function toggleSelectAll() {
    if (selectedAttendees.size === attendees.length) {
      setSelectedAttendees(new Set());
    } else {
      setSelectedAttendees(new Set(attendees.map(a => a.bookingId)));
    }
  }

  function toggleSelectAttendee(bookingId: string) {
    const newSet = new Set(selectedAttendees);
    if (newSet.has(bookingId)) {
      newSet.delete(bookingId);
    } else {
      newSet.add(bookingId);
    }
    setSelectedAttendees(newSet);
  }

  async function addWalkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEventId) return;
    setMessage("");
    try {
      await adminApi<Attendee>("/walk-ins", {
        method: "POST",
        body: JSON.stringify({
          eventId: selectedEventId,
          name: walkIn.name,
          email: walkIn.email,
          phone: walkIn.phone,
          instagram: walkIn.instagram,
          age: walkIn.age ? Number(walkIn.age) : null,
          paymentMethod: walkIn.paymentMethod,
          amountPaidPaise: Math.round(Number(walkIn.amountPaid || selectedEvent?.ticketPricePaise || 0) * (Number(walkIn.amountPaid) ? 100 : 1)),
          source: walkIn.source,
          notes: walkIn.notes,
          checkedIn: walkIn.checkedIn,
          privacyConsent: walkIn.privacyConsent,
          mediaConsent: walkIn.mediaConsent,
        }),
      });
      setWalkIn(walkInInitial);
      await loadAttendees();
      await loadEvents();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to add walk-in."));
    }
  }

  const rows = attendees.map((attendee) => [
    <div key="select" className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={selectedAttendees.has(attendee.bookingId)}
        onChange={() => toggleSelectAttendee(attendee.bookingId)}
        className="w-4 h-4 rounded border-lime-200/30 bg-black/30 text-lime-500 focus:ring-lime-500/50"
      />
    </div>,
    <span key="id" className="text-xs text-lime-100/50">{attendee.ticketCode ?? attendee.bookingId.slice(0, 8)}</span>,
    <span key="event">{attendee.eventTitle}</span>,
    <div key="name"><p className="font-medium text-lime-50">{attendee.name}</p><p className="mt-1 text-xs text-lime-100/42">{attendee.instagram || "No Instagram"}</p></div>,
    <span key="phone">{attendee.phone || "-"}</span>,
    <span key="email">{attendee.email}</span>,
    <StatusChip key="source" tone="neutral">{attendee.source}</StatusChip>,
    <span key="age">{attendee.age ?? "-"}</span>,
    <div key="consent" className="space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${attendee.privacyConsent ? 'bg-lime-500' : 'bg-red-500'}`} />
        <span className="text-xs text-lime-100/70">Privacy</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${attendee.mediaConsent ? 'bg-lime-500' : 'bg-red-500'}`} />
        <span className="text-xs text-lime-100/70">Media</span>
      </div>
    </div>,
    <StatusChip key="checkin" tone={attendee.checkInStatus === "CHECKED_IN" ? "lime" : "amber"}>{attendee.checkInStatus}</StatusChip>,
    <span key="time">{formatDateTime(attendee.registration_time)}</span>,
    <div key="actions" className="flex flex-wrap gap-2">
      {attendee.checkInStatus === "CHECKED_IN" ? <AdminButton variant="ghost" onClick={() => undo(attendee)}>Undo</AdminButton> : <AdminButton variant="ghost" onClick={() => checkIn(attendee)} disabled={!attendee.ticketId}>Check-in</AdminButton>}
      <AdminButton variant="ghost" onClick={() => remove(attendee)}>Delete</AdminButton>
    </div>,
  ]);

  return (
    <>
      <AdminHeader eyebrow="Guest Intelligence" title="Live attendee control, connected to real bookings." description="Search, check in, undo check-ins, delete attendees, and add walk-ins during live Nexus rooms." />
      {message ? <AdminCard className="mb-5 text-amber-100">{message}</AdminCard> : null}
      <AdminCard>
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <label className="grid gap-2">
            <span className="text-xs uppercase tracking-[0.22em] text-lime-100/50">Current event</span>
            <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none">
              {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
            </select>
          </label>
          <AdminToolbar placeholder="Search name, phone, email" value={query} onChange={setQuery} />
        </div>
        <div className="mt-6">
          {selectedEvent ? <p className="text-sm text-lime-100/56">{selectedEvent.registrations} registrations · {selectedEvent.checkedIn} checked in · {formatMoney(selectedEvent.ticketPricePaise)} base ticket</p> : null}
        </div>
      </AdminCard>

      <AdminCard className="mt-5">
        <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Add Walk-in Attendee</p>
        <form onSubmit={addWalkIn} className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Instagram", "instagram"], ["Age", "age"], ["Payment Method", "paymentMethod"], ["Amount INR", "amountPaid"],
          ].map(([label, key]) => (
            <label key={key} className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-lime-100/45">{label}</span>
              <input required={["name", "email"].includes(key)} type={key === "email" ? "email" : key === "age" || key === "amountPaid" ? "number" : "text"} value={walkIn[key as keyof typeof walkIn] as string} onChange={(event) => setWalkIn({ ...walkIn, [key]: event.target.value })} className="h-11 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none" />
            </label>
          ))}
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-lime-100/45">Notes</span>
            <input value={walkIn.notes} onChange={(event) => setWalkIn({ ...walkIn, notes: event.target.value })} className="h-11 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none" />
          </label>
          <div className="space-y-3 md:col-span-3">
            <label className="flex items-center gap-3 rounded-2xl border border-lime-200/12 bg-black/24 px-4 text-sm text-lime-100/70">
              <input type="checkbox" checked={walkIn.privacyConsent} onChange={(event) => setWalkIn({ ...walkIn, privacyConsent: event.target.checked })} />
              Privacy consent accepted
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-lime-200/12 bg-black/24 px-4 text-sm text-lime-100/70">
              <input type="checkbox" checked={walkIn.mediaConsent} onChange={(event) => setWalkIn({ ...walkIn, mediaConsent: event.target.checked })} />
              Media consent accepted
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-lime-200/12 bg-black/24 px-4 text-sm text-lime-100/70">
              <input type="checkbox" checked={walkIn.checkedIn} onChange={(event) => setWalkIn({ ...walkIn, checkedIn: event.target.checked })} />
              Check in instantly
            </label>
          </div>
          <div className="md:col-span-3"><AdminButton type="submit" disabled={!selectedEventId}>Add Walk-in</AdminButton></div>
        </form>
      </AdminCard>

      <div className="mt-5">
        {attendees.length > 0 && (
          <AdminCard className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-lime-100/70">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.size === attendees.length && attendees.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-lime-200/30 bg-black/30 text-lime-500 focus:ring-lime-500/50"
                  />
                  Select All ({selectedAttendees.size} selected)
                </label>
              </div>
              <div className="flex gap-2">
                <AdminButton 
                  variant="ghost" 
                  onClick={bulkCheckIn}
                  disabled={selectedAttendees.size === 0}
                >
                  Check-in Selected
                </AdminButton>
                <AdminButton 
                  variant="ghost" 
                  onClick={bulkUndoCheckIn}
                  disabled={selectedAttendees.size === 0}
                >
                  Undo Check-in Selected
                </AdminButton>
                <AdminButton 
                  variant="ghost" 
                  onClick={bulkDelete}
                  disabled={selectedAttendees.size === 0}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Delete Selected
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        )}
        {events.length === 0 ? <EmptyState title="No current events." detail="Create an event before managing attendees." /> : attendees.length === 0 ? <EmptyState title="No attendees yet." detail="Registrations and walk-ins will appear here from live backend state." /> : (
          <PremiumTable columns={["Select", "ID", "Event", "Name", "Phone", "Email", "Source", "Age", "Consent", "Check-in", "Registration Time", "Actions"]} rows={rows} />
        )}
      </div>
    </>
  );
}

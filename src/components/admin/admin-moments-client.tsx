"use client";

import { FormEvent, useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

import { AdminButton, AdminCard, AdminHeader, EmptyState } from "@/components/admin/admin-ui";
import { adminApi, adminProxyApi, formatAdminError, type AdminEvent } from "@/lib/admin/operations";

type UploadResponse = { uploadUrl: string; publicUrl: string; storageKey: string };

export default function AdminMomentsClient() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    adminApi<AdminEvent[]>("/events/current").then((data) => {
      setEvents(data);
      setEventId(data[0]?.id ?? "");
    }).catch((reason) => setMessage(formatAdminError(reason, "Unable to load events."))).finally(() => setIsLoading(false));
  }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setMessage("");
    setIsUploading(true);
    try {
      const data = await adminProxyApi<UploadResponse>("media/admin/uploads", {
        method: "POST",
        body: JSON.stringify({
          eventId: eventId || null,
          mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          altText,
        }),
      });
      const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("S3 upload failed.");
      setMessage(`Uploaded to ${data.publicUrl || data.storageKey}`);
      setFile(null);
      setAltText("");
    } catch (reason) {
      setMessage(formatAdminError(reason, "Upload failed."));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <AdminHeader eyebrow="Memory System" title="Gallery uploads, backed by S3 presigned operations." description="Upload event-linked images and videos. Published gallery curation can build on the stored media asset records." />
      {message ? <AdminCard className="mb-5 text-amber-100">{message}</AdminCard> : null}
      <AdminCard>
        <form onSubmit={upload} className="grid gap-5">
          <div className="flex min-h-64 flex-col items-center justify-center rounded-[2rem] border border-dashed border-lime-200/22 bg-lime-200/[0.035] p-10 text-center">
            <UploadCloud size={34} className="text-lime-200/70" />
            <h3 className="mt-5 font-serif text-3xl tracking-[-0.035em] text-lime-50">Upload a real event moment</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-lime-100/54">The upload is persisted as a backend media asset and sent through a presigned S3 URL when storage is configured.</p>
            <input type="file" accept="image/*,video/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-6 max-w-full rounded-2xl border border-lime-200/14 bg-black/30 px-4 py-3 text-sm text-lime-100/70" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none">
              <option value="">Platform-level moment</option>
              {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
            </select>
            <input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Alt text" className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none" />
          </div>
          <AdminButton type="submit" disabled={!file || isUploading}>{isUploading ? "Creating Upload" : "Create Upload"}</AdminButton>
        </form>
      </AdminCard>
      <div className="mt-5">
        {isLoading ? <EmptyState title="Loading moments." detail="Checking live event scopes and upload availability." /> : <EmptyState title="No gallery assets yet." detail="This surface starts empty and only records uploads from the backend media system." />}
      </div>
    </>
  );
}

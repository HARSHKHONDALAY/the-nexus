import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config/api";

async function backendJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? "Backend request failed.");
  return body.data as T;
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const event = await backendJson<{ id: string } & Record<string, unknown>>(`/events/slug/${slug}`);
    const ticketTiers = await backendJson<unknown[]>(`/events/${event.id}/ticket-tiers`);
    return NextResponse.json({ data: { event, ticketTiers } });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Event unavailable." }, { status: 404 });
  }
}

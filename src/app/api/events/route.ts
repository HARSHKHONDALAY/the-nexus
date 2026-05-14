import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config/api";

async function backendJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? "Backend request failed.");
  return body.data as T;
}

export async function GET() {
  try {
    const events = await backendJson<unknown[]>("/events/public");
    return NextResponse.json({ data: events });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Events unavailable." }, { status: 500 });
  }
}

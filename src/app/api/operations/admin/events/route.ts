import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config/api";
import type { PlatformEvent, CreateEventRequest } from "@/lib/types/api";

async function backendJson<T>(path: string, headers?: Record<string, string>, body?: CreateEventRequest): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { 
    cache: "no-store",
    method: body ? "POST" : "GET",
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const responseBody = await response.json().catch(() => null);
  if (!response.ok) throw new Error(responseBody?.message ?? "Backend request failed.");
  return responseBody as T;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const eventData = await request.json();
    const event = await backendJson<PlatformEvent>("/operations/admin/events", {
      Authorization: authHeader
    }, eventData);
    
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Event creation failed." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const events = await backendJson<PlatformEvent[]>("/operations/admin/events", {
      Authorization: authHeader
    });
    
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Events unavailable." }, { status: 500 });
  }
}

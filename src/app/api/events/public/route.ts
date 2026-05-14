import { NextResponse } from "next/server";
import { apiClient, safeApiCall } from "@/lib/api/client";

export async function GET() {
  try {
    const events = await safeApiCall(
      async () => await apiClient.get<unknown[]>("/events/public"),
      [],
      "events-public-api"
    );
    return NextResponse.json({ data: events });
  } catch (error) {
    console.error("Events public API error:", error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Events unavailable.",
      data: []
    }, { status: 500 });
  }
}

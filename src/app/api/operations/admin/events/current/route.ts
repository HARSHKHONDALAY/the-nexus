import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config/api";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${getApiBaseUrl()}/operations/admin/events/current`, {
      headers: {
        Authorization: authHeader
      }
    });
    const events = await response.json().catch(() => null);
    if (!response.ok) throw new Error(events?.message ?? "Backend request failed.");
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Events unavailable." }, { status: 500 });
  }
}

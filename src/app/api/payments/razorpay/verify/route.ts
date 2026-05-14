import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config/api";

export async function POST(request: Request) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Payment verification API is unavailable." }, { status: 502 });
  }
}

import { NextResponse } from "next/server";

function apiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") throw new Error("API_BASE_URL must be configured in production.");
  return "http://localhost:8080/api";
}

export async function POST(request: Request) {
  try {
    const response = await fetch(`${apiBaseUrl()}/payments/razorpay/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Payment API is unavailable." }, { status: 502 });
  }
}

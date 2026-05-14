import { NextResponse } from "next/server";
import { apiClient, safeApiCall } from "@/lib/api/client";

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    
    const result = await safeApiCall(
      async () => await apiClient.post("/public/bookings", bookingData),
      null,
      "bookings-api"
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Booking API is unavailable.",
      success: false
    }, { status: 502 });
  }
}

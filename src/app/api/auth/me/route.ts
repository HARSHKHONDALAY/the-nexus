import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth/backend";
import type { AuthUser } from "@/lib/auth/types";

export async function GET() {
  try {
    return NextResponse.json({ data: await backendFetch<AuthUser>("/auth/me") });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Not authenticated." }, { status: 401 });
  }
}

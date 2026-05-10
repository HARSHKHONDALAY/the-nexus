import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { backendFetch } from "@/lib/auth/backend";
import type { AuthResponse } from "@/lib/auth/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth = await backendFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: body.identifier ?? body.email, password: body.password }),
    });
    await setAuthCookies(auth);
    return NextResponse.json({ data: auth.user, message: "Login successful." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Login failed." }, { status: 401 });
  }
}

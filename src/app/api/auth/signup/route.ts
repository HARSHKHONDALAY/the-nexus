import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { backendFetch } from "@/lib/auth/backend";
import type { AuthResponse } from "@/lib/auth/types";

export async function POST(request: Request) {
  try {
    const auth = await backendFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(await request.json()),
    });
    await setAuthCookies(auth);
    return NextResponse.json({ data: auth.user, message: "Account created." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Signup failed." }, { status: 400 });
  }
}

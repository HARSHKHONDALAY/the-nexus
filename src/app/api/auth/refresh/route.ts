import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth/backend";
import { clearAuthCookies, REFRESH_TOKEN_COOKIE, setAuthCookies } from "@/lib/auth/cookies";
import type { AuthResponse } from "@/lib/auth/types";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) throw new Error("No refresh token available.");
    const auth = await backendFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    await setAuthCookies(auth);
    return NextResponse.json({ data: auth.user });
  } catch (error) {
    await clearAuthCookies();
    return NextResponse.json({ message: error instanceof Error ? error.message : "Session expired." }, { status: 401 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth/backend";
import { clearAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
  if (refreshToken) {
    await backendFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }).catch(() => null);
  }
  await clearAuthCookies();
  return NextResponse.json({ data: null, message: "Logged out." });
}

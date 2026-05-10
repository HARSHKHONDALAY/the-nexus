import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "nexus_access_token";
export const REFRESH_TOKEN_COOKIE = "nexus_refresh_token";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const secure = process.env.NODE_ENV === "production" || (siteUrl.startsWith("https://") && !siteUrl.includes("localhost"));

export async function setAuthCookies(auth: {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}) {
  const store = await cookies();
  const accessExpires = new Date(auth.accessTokenExpiresAt);

  store.set(ACCESS_TOKEN_COOKIE, auth.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: accessExpires,
  });
  store.set(REFRESH_TOKEN_COOKIE, auth.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]) {
    store.set(name, "", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 });
  }
}

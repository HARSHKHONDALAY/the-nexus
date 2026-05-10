import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./cookies";
import type { ApiEnvelope } from "./types";

function apiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_BASE_URL must be configured in production.");
  }
  return "http://localhost:8080/api";
}

export async function backendFetch<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const method = (init.method ?? "GET").toUpperCase();

  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(`${method} ${path} could not reach the backend at ${apiBaseUrl()}.`);
  }

  const text = await response.text();
  let body: (ApiEnvelope<T> | { message?: string }) | null = null;
  if (text) {
    try {
      body = JSON.parse(text) as ApiEnvelope<T> | { message?: string };
    } catch {
      body = { message: text };
    }
  }
  if (!response.ok) {
    throw new Error(body?.message ?? `${method} ${path} failed with ${response.status}.`);
  }

  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new Error(`${method} ${path} returned an invalid response shape.`);
  }

  return body?.data as T;
}

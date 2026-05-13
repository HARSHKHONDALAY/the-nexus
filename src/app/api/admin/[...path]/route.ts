import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";

function apiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_BASE_URL must be configured in production.");
  }
  return "http://localhost:8080/api";
}

async function parseBackendPayload(response: Response) {
  const text = await response.text();
  const contentType = response.headers.get("Content-Type") ?? "application/json";

  if (!text) {
    return { contentType, raw: "", json: null as { message?: string; data?: unknown } | null };
  }

  try {
    return {
      contentType,
      raw: text,
      json: JSON.parse(text) as { message?: string; data?: unknown },
    };
  } catch {
    return { contentType, raw: text, json: null as { message?: string; data?: unknown } | null };
  }
}

async function proxy(request: Request, params: Promise<{ path: string[] }>) {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const path = (await params).path.join("/");
  const sourceUrl = new URL(request.url);
  const target = `${apiBaseUrl()}/${path}${sourceUrl.search}`;
  
  // Preserve FormData body - don't convert to text
  const contentType = request.headers.get("Content-Type");
  const isFormData = contentType?.includes("multipart/form-data");
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : 
    isFormData ? await request.formData() : await request.text();

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for non-FormData requests
    if (!isFormData && contentType) {
      headers["Content-Type"] = contentType;
    }

    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const payload = await parseBackendPayload(response);

    if (!response.ok) {
      const backendMessage = payload.json?.message ?? (payload.raw.trim() || response.statusText);
      const genericUnexpected = backendMessage === "Unexpected backend error.";

      return NextResponse.json(
        {
          message: genericUnexpected
            ? `${request.method} /${path} failed with ${response.status}. The backend threw an unexpected error while processing this admin request.`
            : backendMessage,
          backendMessage,
          endpoint: `/${path}`,
          status: response.status,
          method: request.method,
        },
        { status: response.status },
      );
    }

    if (payload.json) {
      return NextResponse.json(payload.json, { status: response.status });
    }

    return new NextResponse(payload.raw, {
      status: response.status,
      headers: {
        "Content-Type": payload.contentType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: `${request.method} /${path} could not reach the backend API.`,
        endpoint: `/${path}`,
        status: 502,
        method: request.method,
        backendMessage: "Backend operations API is unreachable.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context.params);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context.params);
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context.params);
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context.params);
}

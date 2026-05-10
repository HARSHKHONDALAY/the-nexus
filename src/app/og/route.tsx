import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/config";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? siteConfig.name;
  const eyebrow = searchParams.get("eyebrow") ?? "Premium Events";
  const description =
    searchParams.get("description") ??
    "Premium cinematic events, culture rooms, and community experiences in Mumbai.";
  const variant = searchParams.get("variant") ?? "default";
  const accent = variant === "event" ? "#bef264" : "#67e8f9";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#030712",
          color: "white",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 16%, rgba(103,232,249,.26), transparent 35%), radial-gradient(circle at 82% 26%, rgba(190,242,100,.22), transparent 32%), linear-gradient(135deg, rgba(255,255,255,.08), transparent 45%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 74,
            right: 72,
            bottom: 74,
            border: "1px solid rgba(255,255,255,.18)",
            borderRadius: 40,
            background: "rgba(255,255,255,.055)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 58,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 16, background: accent }} />
            <div style={{ letterSpacing: 9, fontSize: 22, color: "rgba(255,255,255,.72)" }}>THE NEXUS</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ color: accent, letterSpacing: 8, textTransform: "uppercase", fontSize: 24 }}>
              {eyebrow}
            </div>
            <div style={{ fontSize: title.length > 42 ? 72 : 88, lineHeight: 0.95, letterSpacing: -3, maxWidth: 900 }}>
              {title}
            </div>
            <div style={{ fontSize: 28, color: "rgba(255,255,255,.66)", lineHeight: 1.25, maxWidth: 860 }}>
              {description}
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, color: "rgba(255,255,255,.62)", fontSize: 22 }}>
            <span>Chess socials</span>
            <span>•</span>
            <span>Art workshops</span>
            <span>•</span>
            <span>Networking experiences</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

import { ImageResponse } from "next/og";
import { brand } from "@/content/facts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #18110C 0%, #4A3626 60%, #6B6B45 100%)",
          color: "#FAF6EE",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#DCC9A3", display: "flex" }}>전라남도 무안 · {brand.name}</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 24, display: "flex", maxWidth: 900 }}>{brand.tagline}</div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#E8DBC0", display: "flex" }}>{brand.subTagline}</div>
      </div>
    ),
    size
  );
}

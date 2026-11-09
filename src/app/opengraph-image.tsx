import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt =
  "Parth Khansali, computer science student and software developer in Dehradun, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A real 1200x630 social card, generated at build time.
 *
 * The previous metadata declared profile.jpg as 1200x630 while the file was a
 * square portrait, so every shared link was cropped badly.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#141416",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "46px",
              height: "46px",
              border: "1px solid #00ef4e",
              borderRadius: "12px",
              color: "#00ef4e",
              fontSize: "19px",
            }}
          >
            PK
          </div>
          <div style={{ display: "flex", color: "#8a8a99", fontSize: "22px" }}>
            parthkhansali.tech
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "104px",
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            Parth Khansali
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "#b0b0bd",
              lineHeight: 1.35,
              maxWidth: "820px",
            }}
          >
            Computer science student and software developer in Dehradun, India.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: "26px",
          }}
        >
          <div style={{ display: "flex", fontSize: "22px", color: "#8a8a99" }}>
            Developer of GEHU Connect · Netwich · ARANYA
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              color: "#00ef4e",
            }}
          >
            <span style={{ fontSize: "46px", letterSpacing: "-0.03em" }}>~1,000</span>
            <span style={{ fontSize: "20px", color: "#b0b0bd" }}>students</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

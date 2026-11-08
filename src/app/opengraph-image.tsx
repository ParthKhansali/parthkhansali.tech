import { ImageResponse } from "next/og";

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
          background: "#0e1116",
          color: "#eef2f7",
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
              border: "1px solid #3c4a5c",
              borderRadius: "8px",
              color: "#6fb3ff",
              fontSize: "19px",
            }}
          >
            PK
          </div>
          <div style={{ display: "flex", color: "#8b9aae", fontSize: "22px" }}>
            parthkhansali.tech
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "104px",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            Parth Khansali
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "#a9b6c7",
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
            borderTop: "1px solid #2a3544",
            paddingTop: "26px",
          }}
        >
          <div style={{ display: "flex", fontSize: "22px", color: "#8b9aae" }}>
            Developer of GEHU Connect · Netwich · ARANYA
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              color: "#f0b04a",
            }}
          >
            <span style={{ fontSize: "46px", letterSpacing: "-0.03em" }}>~1,000</span>
            <span style={{ fontSize: "20px", color: "#a9b6c7" }}>students</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

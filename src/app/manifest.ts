import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parth Khansali — AI & Software Engineer",
    short_name: "Parth Khansali",
    description:
      "The portfolio and workshop log of Parth Khansali, an AI and software engineering student in Dehradun.",
    start_url: "/",
    display: "standalone",
    background_color: "#14120f",
    theme_color: "#14120f",
    lang: "en-IN",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

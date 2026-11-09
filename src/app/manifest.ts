import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parth Khansali — computer science student and software developer",
    short_name: "Parth Khansali",
    description:
      "The work of Parth Khansali: GEHU Connect, Netwich, and other builds from Dehradun, India.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

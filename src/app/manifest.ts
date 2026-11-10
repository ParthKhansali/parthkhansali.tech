import type { MetadataRoute } from "next";
import { withBasePath } from "@/data/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parth Khansali: computer science student and software developer",
    short_name: "Parth Khansali",
    description:
      "The work of Parth Khansali: GEHU Connect, Netwich, and other builds from Dehradun, India.",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#141416",
    theme_color: "#141416",
    lang: "en",
    icons: [
      {
        src: withBasePath("/icon.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

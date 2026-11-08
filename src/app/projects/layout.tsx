import type { Metadata } from "next";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects & Engineering Builds",
  description:
    "Explore software projects built by Parth Khansali across AI systems, mobile applications, distributed workflows, and developer tooling.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Engineering Builds | Parth Khansali",
    description:
      "Explore software projects built by Parth Khansali across AI systems, mobile applications, distributed workflows, and developer tooling.",
     url: absoluteUrl("/projects"),
    images: [
      {
        url: "/developer-night-banner.jpg",
        width: 1376,
        height: 768,
        alt: "Parth Khansali's developer workspace and project archive",
      },
    ],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

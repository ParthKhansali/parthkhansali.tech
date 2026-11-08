import type { Metadata } from "next";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae",
  description:
    "Official resume and background of Parth Khansali, Computer Science student at Graphic Era Hill University, builder, and Director General of Graphic Era MUN Club.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume & Curriculum Vitae | Parth Khansali",
    description:
      "Official resume and background of Parth Khansali, Computer Science student at Graphic Era Hill University, builder, and Director General of Graphic Era MUN Club.",
     url: absoluteUrl("/resume"),
    images: [
      {
        url: "/developer-night-banner.jpg",
        width: 1376,
        height: 768,
        alt: "Parth Khansali's developer workspace",
      },
    ],
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

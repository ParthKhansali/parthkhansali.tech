import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Lounge: Visitor Wall & Retro CRT Station",
  description:
    "Sign in with Google to leave a note or sketch on Parth Khansali's Lounge wall, or test the retro CRT workstation with arcade games and lofi audio.",
  path: "/lounge",
});

export default function LoungeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


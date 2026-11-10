import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Redirecting to The Lounge",
  alternates: { canonical: "/lounge/" },
  robots: { index: false, follow: true },
};

export default function WallRedirect() {
  redirect("/lounge/");
}

import Hero from "@/components/sections/Hero";
import PortalMarquee from "@/components/sections/PortalMarquee";
import CraftNote from "@/components/sections/CraftNote";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import DevDashboard from "@/components/dashboard/DevDashboard";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import GuestbookSection from "@/components/sections/GuestbookSection";
import ClosingCTA from "@/components/sections/ClosingCTA";
import SiteFooter from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main className="relative bg-[#14120f] text-[#f4eee4]">
      {/* 1. Clean Typographic Engineering Hero */}
      <Hero />

      {/* 2. 3D Nether Portal Dual Crisscross Skills Marquee */}
      <PortalMarquee />

      {/* 3. The maker's note: process, taste, and working principles */}
      <CraftNote />

      {/* 4. Featured Projects with Enchanted Book & Breathing Cards */}
      <FeaturedProjects />

      {/* 5. Developer Systems Deck (Terminal, WakaTime, Spotify) */}
      <DevDashboard />

      {/* 6. About & Multidisciplinary Capabilities */}
      <About />

      {/* 7. Career & Leadership Journey with Gavel Easter Egg */}
      <Experience />

      {/* 8. Live Community Guestbook & Real-Time Reviews */}
      <GuestbookSection />

      {/* 9. Closing CTA Section with Parallax Voxel Night Sky & Perched Mascot */}
      <ClosingCTA />

      {/* 10. Site Footer with Live Views */}
      <SiteFooter />
    </main>
  );
}

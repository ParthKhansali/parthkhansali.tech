import CampfireToggle from "@/components/effects/CampfireToggle";

const workingNotes = [
  {
    number: "01",
    title: "Start with the irritation",
    body: "A small annoyance is usually a better brief than a giant feature list. I look for the friction, then ask what would make the whole experience feel lighter.",
  },
  {
    number: "02",
    title: "Make the invisible legible",
    body: "Whether it is an AI decision, a media pipeline, or a distributed event, I like showing the moving parts instead of hiding behind a glossy button.",
  },
  {
    number: "03",
    title: "Ship, then stay curious",
    body: "The first version is a conversation with reality. Real users, awkward edge cases, and an honest post-mortem are where the interesting engineering begins.",
  },
];

export default function CraftNote() {
  return (
    <section
      id="how-i-work"
      className="section-padding workshop-grid relative overflow-hidden border-b border-[#f4eee4]/[0.08] bg-[#1a1713]"
      aria-labelledby="craft-note-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <header className="max-w-md">
          <p className="section-kicker">A note from the workbench</p>
          <h2
            id="craft-note-heading"
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[0.98] tracking-tight text-[#f4eee4]"
          >
            Good software has fingerprints.
          </h2>
          <p className="mt-5 text-sm leading-[1.8] text-[#a69d8e]">
            I am drawn to work that feels considered: technically sound, useful
            in the messy real world, and human enough that someone remembers who
            made it. This is the bit between the idea and the launch.
          </p>
          <div className="mt-7 inline-flex rotate-[-2deg] items-center gap-2 border-b border-[#d37458]/70 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d37458]">
            <span aria-hidden="true">↳</span>
            <span>curiosity → prototype → proof</span>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {workingNotes.map((note) => (
            <article
              key={note.number}
              className="paper-card rounded-xl border border-[#4a4033] bg-[#211c17] p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#e2b66d]">{note.number}</span>
                <span className="h-px w-8 bg-[#e2b66d]/40" aria-hidden="true" />
              </div>
              <h3 className="mt-10 font-display text-lg font-semibold leading-tight text-[#f4eee4]">
                {note.title}
              </h3>
              <p className="mt-3 text-xs leading-[1.75] text-[#a69d8e]">{note.body}</p>
            </article>
          ))}
        </div>

        <CampfireToggle />
      </div>
    </section>
  );
}

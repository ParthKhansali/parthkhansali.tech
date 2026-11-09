/**
 * A ribbon of text that scrolls forever.
 *
 * Two copies of the list are rendered so the track can translate by exactly
 * half its width and loop without a seam. The duplicate is hidden from
 * assistive tech; the ribbon itself is decorative — every phrase in it also
 * appears in real copy on the page.
 */
export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const run = (hidden: boolean) => (
    <span className="marquee__run" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span className="marquee__item" key={`${hidden ? "b" : "a"}-${item}`}>
          {item}
          <span className="marquee__star" aria-hidden="true">
            ✳
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`marquee ${className}`.trim()} aria-hidden="true">
      <div className="marquee__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

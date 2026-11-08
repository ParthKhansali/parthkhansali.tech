/**
 * JSON-LD emitted as a plain script tag in server-rendered HTML, so crawlers
 * that do not execute JavaScript still see it.
 *
 * `<` is escaped because a literal `</script` inside the payload would end the
 * script element early. `\u003c` is valid JSON and parses identically.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // The payload is generated from typed local data, never user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

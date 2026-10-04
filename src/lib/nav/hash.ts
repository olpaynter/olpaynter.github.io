/**
 * The section an address hash names, such as `journey/icrtouch` for `#journey/icrtouch`. A hash
 * with a stray `%`, which the browser leaves unencoded, is read as written rather than throwing.
 */
export function sectionFromHash(hash: string): string {
  const raw = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** The address hash for a section, encoded as the browser shows it, with `/` kept readable. */
export function hashFor(section: string): string {
  return `#${encodeURIComponent(section).replace(/%2F/gi, "/")}`;
}

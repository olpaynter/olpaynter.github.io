/** Every item of a tree and its descendants, in reading order. */
export function walk<T extends { children?: T[] }>(items: T[]): T[] {
  return items.flatMap((item) => [item, ...walk(item.children ?? [])]);
}

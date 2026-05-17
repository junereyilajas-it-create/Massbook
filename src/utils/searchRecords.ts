export function normalizeSearchText(input: string): string {
  return input.trim().toLowerCase();
}

export function matchesQuery(haystack: string, query: string): boolean {
  const q = normalizeSearchText(query);
  if (!q) return true;
  return haystack.toLowerCase().includes(q);
}


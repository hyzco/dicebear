export function applyAliases(array: string[], aliases: Record<string, string>): string[] {
  return array.map((val) => aliases[val] || val);
}

export function filter(array: string[], value: string, preventEmpty = false): string[] {
  return array.filter((val) => val !== value) || (preventEmpty ? array : []);
}

export function encode(value: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(value)}`;
}

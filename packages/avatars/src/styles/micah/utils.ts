export function filterBaseColor(colors: string[], baseColor: string) {
  return colors.filter((color) => color != baseColor) || colors;
}

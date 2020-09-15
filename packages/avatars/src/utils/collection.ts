export function applyAliases<T extends Record<string, any>>(collection: T, aliases: Record<string, string>): T {
  return {
    ...Object.keys(aliases).reduce<any>((result, key) => {
      result[aliases[key]] = collection[key];

      return result;
    }, {}),
    ...collection,
    ...Object.keys(aliases).reduce<any>((result, key) => {
      result[key] = undefined;

      return result;
    }, {}),
  };
}

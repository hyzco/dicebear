export function applyAliases<T extends Record<string, any>>(object: T, aliases: Record<string, string>): T {
  return {
    ...Object.keys(aliases).reduce<any>((result, key) => {
      result[aliases[key]] = object[key];

      return result;
    }, {}),
    ...object,
  };
}

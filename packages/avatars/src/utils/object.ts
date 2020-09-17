type AliasProps<T> = {
  object: T;
  aliases: Record<string, string>;
};

export function alias<T extends Record<string, any>>({ object, aliases }: AliasProps<T>): T {
  return {
    ...Object.keys(aliases).reduce<any>((result, key) => {
      result[aliases[key]] = object[key];

      return result;
    }, {}),
    ...object,
  };
}

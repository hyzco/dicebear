type AliasProps<T> = {
  values: (string | T)[];
  aliases: Record<string, T>;
};

export function alias<T>({ values: array, aliases }: AliasProps<T>): T[] {
  return array.map((val) => {
    if (typeof val === 'string') {
      return aliases[val];
    }

    return val;
  });
}

type FilterProps = {
  array: string[];
  values: string[];
  preventEmpty?: boolean;
};

export function filter({ array, values, preventEmpty = false }: FilterProps): string[] {
  return array.filter((val) => values.includes(val)) || (preventEmpty ? [array[0]] : []);
}

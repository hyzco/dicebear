type AliasProps<T> = {
  values: (string | T)[];
  aliases: Record<string, T>;
  fallback?: (value: string | T) => T | undefined;
};

export function alias<T>({ values: array, aliases, fallback = () => undefined }: AliasProps<T>): T[] {
  let result: T[] = [];

  array.forEach((val) => {
    if (typeof val === 'string') {
      val = aliases[val] ?? fallback(val);
    } else {
      val = fallback(val);
    }

    if (val !== undefined) {
      result.push(val);
    }
  });

  return result;
}

type FilterProps = {
  array: string[];
  values: string[];
  preventEmpty?: boolean;
};

export function filter({ array, values, preventEmpty = false }: FilterProps): string[] {
  return array.filter((val) => false === values.includes(val)) || (preventEmpty ? [array[0]] : []);
}

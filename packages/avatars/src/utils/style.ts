import type { Style, StyleOptions } from '../types';
import { schema as coreSchema } from '../schema';
import { schema } from './';

export function options<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let result: StyleOptions<O> = {
    seed: Math.random().toString(),
    ...schema.defaults(coreSchema),
    ...schema.defaults(style.schema),
    ...options,
  };

  let coreAndStyleAliases = [...schema.aliases(coreSchema), ...schema.aliases(style.schema)];

  coreAndStyleAliases.forEach((aliases) => {
    let val = aliases.reduce<any>((current, alias) => {
      return current || result[alias];
    }, undefined);

    aliases.forEach((alias: keyof StyleOptions<O>) => {
      result[alias] = val;
    });
  });

  return result;
}

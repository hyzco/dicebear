import type { Style, StyleOptions } from '../types';
import { schema as coreSchema } from '../schema';
import * as schema from './schema';

export function options<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let result: StyleOptions<O> = {
    seed: Math.random().toString(),
    ...schema.defaults(coreSchema),
    ...schema.defaults(style.schema),
    ...options,
  };

  let aliases = { ...schema.aliases(coreSchema), ...schema.aliases(style.schema) };

  Object.keys(aliases).forEach((alias) => {
    result[aliases[alias] as keyof StyleOptions<O>] = (result[aliases[alias]] || result[alias]) as any;
  });

  return result;
}

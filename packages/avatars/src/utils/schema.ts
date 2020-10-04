import type { JSONSchema7Type, JSONSchema7 } from 'json-schema';

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function resolve(schema: JSONSchema7, dependencies: JSONSchema7[] = []): JSONSchema7 {
  const paths = new Map<string, any>();
  const refs: Array<{
    parent: Record<string, any>;
    field: string;
    path: string;
  }> = [];

  schema = clone(schema);
  dependencies = dependencies.map(clone);

  const traverse = (parent: Record<string, any>, field: string = undefined, base = 'http://localhost') => {
    let obj = field ? parent[field] : parent;
    let [path, hash] = base.split('#');
    let url = obj.$id ? new URL(obj.$id, path).toString() : field ? `${path}#${hash || ''}/${field}` : path;

    paths.set(url, obj);

    if (obj === Object(obj)) {
      Object.keys(obj).forEach((prop) => {
        if (prop === '$ref') {
          refs.push({
            parent,
            field,
            path: base,
          });
        } else {
          traverse(obj, prop, url);
        }
      });
    }
  };

  [schema, ...dependencies].forEach((obj) => traverse(obj));

  refs.forEach(({ parent, field, path }) => {
    let obj = parent[field];
    let ref = paths.get(new URL(obj.$ref, path).toString());

    parent[field] = {
      ...ref,
      ...obj,
    };

    delete parent[field].$ref;
  });

  return schema;
}

export function defaults(schema: JSONSchema7) {
  let defaults: Record<string, unknown> = {};

  const traverse = (obj: Record<string, any>, isProperties: boolean = false) => {
    Object.keys(obj).forEach((key) => {
      if (key === 'properties') {
        traverse(obj[key], true);
      } else if (['oneOf', 'allOf', 'anyOf'].includes(key)) {
        obj[key].forEach((child: any) => traverse(child, isProperties));
      }

      if (isProperties && obj[key].default) {
        if (isProperties) {
          defaults = {
            ...defaults,
            [key]: obj[key].default,
          };
        } else {
          defaults = {
            ...obj[key].default,
            ...defaults,
          };
        }
      }
    });
  };

  traverse(schema);

  return defaults;
}

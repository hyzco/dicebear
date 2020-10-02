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
  return Object.keys(schema.properties).reduce<Record<string, JSONSchema7Type>>((result, key) => {
    let val = schema.properties[key];

    if (typeof val === 'object' && val.default) {
      result[key] = val.default;
    }

    return result;
  }, {});
}

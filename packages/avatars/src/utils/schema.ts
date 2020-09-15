import { JSONSchema7, JSONSchema7Type } from 'json-schema';

export function resolveReferences(schema: JSONSchema7) {
  return JSON.parse(
    JSON.stringify(schema, (key, value) => {
      if (typeof value === 'object' && value.$ref) {
        let parts: string[] = value.$ref.replace(/^#\//, '').split('/');
        let ref: any = schema;

        parts.forEach((part) => (ref = ref[part]));

        value = {
          ...ref,
          ...value,
        };
      }

      return value;
    })
  );
}

export function examples(schema: JSONSchema7) {
  return Object.keys(schema.properties).reduce<Record<string, JSONSchema7Type[]>>((result, key) => {
    let val = schema.properties[key];

    if (typeof val !== 'boolean' && val.examples) {
      result[key] = val.examples as JSONSchema7Type[];
    }

    return result;
  }, {});
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

export function aliases(schema: JSONSchema7) {
  return Object.keys(schema.properties).reduce<Record<string, string>>((result, key) => {
    let val = schema.properties[key];

    if (typeof val === 'object' && val.$ref && Object.keys(val).length === 0) {
      let match = val.$ref.match(/^#\/properties\/([^\/]+)$/);

      if (match) {
        result[key] = match[1];
      }
    }

    return result;
  }, {});
}

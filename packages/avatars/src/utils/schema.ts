import type { JSONSchema7 } from 'json-schema';

export function defaults(schema: JSONSchema7) {
  let result: Record<string, unknown> = {};
  let properties = schema.properties || {};

  Object.keys(properties).forEach((key) => {
    let val = properties[key];

    if (typeof val === 'object') {
      result = {
        ...result,
        [key]: val.default,
      };
    }
  });

  return result;
}

export function examples(schema: JSONSchema7) {
  let result: Record<string, unknown> = {};
  let properties = schema.properties || {};

  Object.keys(properties).forEach((key) => {
    let val = properties[key];

    if (typeof val === 'object') {
      result = {
        ...result,
        [key]: val.examples,
      };
    }
  });

  return result;
}

export function aliases(schema: JSONSchema7) {
  let result: Record<string, string[]> = {};
  let properties = schema.properties || {};

  Object.keys(properties).forEach((key) => {
    let val = properties[key];

    if (typeof val === 'object') {
      let title = val.title;

      if (title) {
        result = {
          ...result,
          [title]: [...(result[title] || []), key],
        };
      }
    }
  });

  return Object.values(result).filter((val) => val.length > 1);
}

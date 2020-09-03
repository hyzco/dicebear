import { JSONSchema7 } from 'json-schema';
import { IOptions } from './interfaces';

export function applyAliases<O extends {}>(options: IOptions<O>): IOptions<O> {
  return {
    ...{
      radius: options.r,
      width: options.w,
      height: options.h,
      margin: options.m,
      backgroundColor: options.b,
    },
    ...options,
  };
}

export const schema: JSONSchema7 = {
  type: 'object',
  definitions: {
    seed: {
      type: 'string',
    },
    radius: {
      type: 'number',
      minimum: 0,
      maximum: 50,
    },
    dataUri: {
      type: 'boolean',
    },
    width: {
      type: 'number',
    },
    height: {
      type: 'number',
    },
    margin: {
      type: 'number',
      minimum: 0,
      maximum: 25,
    },
    backgroundColor: {
      type: 'string',
    },
  },
  properties: {
    seed: { $ref: '#/definitions/seed' },
    s: { $ref: '#/definitions/seed' },
    radius: { $ref: '#/definitions/radius' },
    r: { $ref: '#/definitions/radius' },
    dataUri: { $ref: '#/definitions/dataUri' },
    width: { $ref: '#/definitions/width' },
    w: { $ref: '#/definitions/width' },
    height: { $ref: '#/definitions/height' },
    h: { $ref: '#/definitions/height' },
    margin: { $ref: '#/definitions/margin' },
    m: { $ref: '#/definitions/margin' },
    backgroundColor: { $ref: '#/definitions/backgroundColor' },
    b: { $ref: '#/definitions/backgroundColor' },
  },
};

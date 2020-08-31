import { JSONSchema7 } from 'json-schema';

export type IDefaultOptions = {
  seed?: string;
  s?: string;
  radius?: number;
  r?: number;
  dataUri?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  backgroundColor?: string;
  b?: string;
  /** @deprecated use `backgroundColor instead` */
  background?: string;
  /** @deprecated use `dataUri` instead */
  base64?: boolean;
  /** @deprecated **/
  userAgent?: string;
};

export type IOptions<O extends {}> = O & IDefaultOptions;

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
    base64: {
      type: 'boolean',
    },
    userAgent: {
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
    background: { $ref: '#/definitions/backgroundColor' },
    base64: { $ref: '#/definitions/base64' },
    userAgent: { $ref: '#/definitions/userAgent' },
  },
};

// hatProbability wird durch ein hat = '' deaktiviert.
// Welche Gruppen es in der UI gibt, gibt der Name vor. hat, hatColor,...
// Es werden nur solche Felder in der UI angezeigt, die entweder enum sind oder examples haben.
// Jedes Feld muss benannt werden. Steht im Feld der Begriff Color impliziert das ein color input.
// Aliase werden automatisch anhand identischer refs ermittelt.

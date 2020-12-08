import type { JSONSchema7 } from 'json-schema';

const color: JSONSchema7 = {
  type: 'string',
  pattern: '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})+$',
};

const radius: JSONSchema7 = {
  title: 'Radius',
  type: 'number',
  minimum: 0,
  maximum: 50,
  default: 0,
};

const width: JSONSchema7 = {
  title: 'Width',
  type: 'number',
  minimum: 0,
};

const height: JSONSchema7 = {
  title: 'Height',
  type: 'number',
  minimum: 0,
};

const margin: JSONSchema7 = {
  title: 'Margin',
  type: 'number',
  minimum: 0,
  maximum: 25,
  default: 0,
};

const backgroundColor: JSONSchema7 = {
  title: 'Background Color',
  oneOf: [
    color,
    {
      type: 'array',
      items: color,
    },
  ],
};

export const schema: JSONSchema7 = {
  title: 'Options',
  type: 'object',
  properties: {
    seed: {
      title: 'Seed',
      type: 'string',
    },
    dataUri: {
      title: 'Data URI',
      type: 'boolean',
      default: false,
    },
    radius,
    r: radius,
    width,
    w: width,
    height,
    h: height,
    margin,
    m: margin,
    backgroundColor,
    b: backgroundColor,
  },
};

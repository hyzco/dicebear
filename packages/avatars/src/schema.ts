import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

const color: JSONSchema7 = {
  oneOf: [
    {
      type: 'string',
      pattern: '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})+$',
    },
    {
      type: 'string',
      enum: ['transparent'],
    },
  ],
};

const radius: JSONSchema7 = {
  title: 'Radius',
  description: 'Avatar Border Radius. Min: `0`, Max: `50`',
  type: 'number',
  minimum: 0,
  maximum: 50,
  default: 0,
};

const width: JSONSchema7 = {
  title: 'Width',
  description: 'Fixed Width. Min: `0`',
  type: 'number',
  minimum: 0,
};

const height: JSONSchema7 = {
  title: 'Height',
  description: 'Fixed Height. Min: `0`',
  type: 'number',
  minimum: 0,
};

const margin: JSONSchema7 = {
  title: 'Margin',
  description: 'Margin in percent. Min: `0`, Max: `25`',
  type: 'number',
  minimum: 0,
  maximum: 25,
  default: 0,
};

const backgroundColor: JSONSchema7 = {
  title: 'Background Color',
  description: '`transparent` and hex values are allowed. Use url encoded hash `%23` for HTTP-API.',
  oneOf: [
    ...(color.oneOf as JSONSchema7Definition[]),
    {
      type: 'array',
      items: color,
    },
  ],
  default: 'transparent',
};

export const schema: JSONSchema7 = {
  title: 'Options',
  type: 'object',
  properties: {
    seed: {
      title: 'Seed',
      description: 'Seed to be used for the PRNG.',
      type: 'string',
    },
    dataUri: {
      title: 'Data URI',
      description: 'Return avatar as data uri instead of XML. *(Not supported by the HTTP API)*',
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

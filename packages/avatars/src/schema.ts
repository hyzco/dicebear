import type { JSONSchema7 } from 'json-schema';

export const defaultSchema: JSONSchema7 = {
  type: 'object',
  definitions: {
    probability: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },
    color: {
      type: 'string',
      pattern: '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})+$',
    },
  },
  properties: {
    seed: {
      type: 'string',
      title: 'Seed',
    },
    s: {
      $ref: '#/properties/seed',
    },
    radius: {
      type: 'number',
      title: 'Radius',
      minimum: 0,
      maximum: 50,
    },
    r: {
      $ref: '#/properties/radius',
      title: 'Radius',
    },
    dataUri: {
      type: 'boolean',
      title: 'Data URI',
    },
    width: {
      type: 'number',
      title: 'Width',
      minimum: 0,
    },
    w: {
      $ref: '#/properties/width',
    },
    height: {
      type: 'number',
      title: 'Height',
      minimum: 0,
    },
    h: {
      $ref: '#/properties/height',
    },
    margin: {
      type: 'number',
      title: 'Margin',
      minimum: 0,
      maximum: 25,
    },
    m: {
      $ref: '#/properties/margin',
    },
    backgroundColor: {
      type: 'array',
      title: 'Background Color',
      items: {
        $ref: '#/definitions/color',
      },
    },
    b: {
      $ref: '#/properties/backgroundColor',
    },
  },
};

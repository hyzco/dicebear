import { IStyleSchema } from '../../interfaces';
import { defaultSchema } from '../../schema';
import { resolveReferences } from '../../utils/schema';

import Color from './colors';
import * as paths from './paths';

const schema: IStyleSchema = resolveReferences({
  ...defaultSchema,
  definitions: {
    ...defaultSchema.definitions,
    colors: {
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'string',
            enum: Object.keys(Color),
          },
          {
            $ref: '#/definitions/color',
          },
        ],
      },
    },
  },
  properties: {
    ...defaultSchema.properties,
    baseColor: {
      $ref: '#/definitions/colors',
      title: 'Base Color',
      default: ['apricot', 'coast', 'topaz'],
      examples: [[Color.apricot], [Color.coast], [Color.topaz]],
    },
    earringColor: {
      $ref: '#/definitions/colors',
      title: 'Earring Color',
      default: [],
      examples: Object.keys(Color).map((color) => [color]),
    },
    earrings: {
      type: 'array',
      title: 'Earrings',
      items: {
        type: 'string',
        enum: Object.keys(paths.earrings.aliases),
      },
      default: [],
      examples: Object.keys(paths.earrings.aliases).map((part) => [part]),
    },
    earringsProbability: {
      $ref: '#/definitions/probability',
      title: 'Earrings Probability',
      default: 30,
    },
    ears: {
      type: 'array',
      title: 'Ears',
      items: {
        type: 'string',
        enum: Object.keys(paths.ears.aliases),
      },
      default: [],
      examples: Object.keys(paths.ears.aliases).map((part) => [part]),
    },
    eyebrowColor: {
      $ref: '#/definitions/colors',
      title: 'Eyebrow Color',
      default: ['black'],
      examples: [Object.values(Color).map((color) => [color])],
    },
    eyebrows: {
      type: 'array',
      title: 'Eyebrows',
      items: {
        type: 'string',
        enum: Object.keys(paths.eyebrows.aliases),
      },
      default: [],
      examples: Object.keys(paths.eyebrows.aliases).map((color) => [color]),
    },
    eyeColor: {
      $ref: '#/definitions/colors',
      title: 'Eye Color',
      default: [],
      examples: Object.values(Color).map((color) => [color]),
    },
    eyes: {
      type: 'array',
      title: 'Eyes',
      items: {
        type: 'string',
        enum: Object.keys(paths.eyes.aliases),
      },
      default: [],
      examples: Object.keys(paths.eyes.aliases).map((part) => [part]),
    },
    facialHair: {
      type: 'array',
      title: 'Facial Hair',
      items: {
        type: 'string',
        enum: Object.keys(paths.facialHair.aliases),
      },
      default: [],
      examples: Object.keys(paths.facialHair.aliases).map((part) => [part]),
    },
    facialHairProbability: {
      $ref: '#/definitions/probability',
      title: 'Facial Hair Probability',
      default: 30,
    },
    glassesColor: {
      $ref: '#/definitions/colors',
      title: 'Glasses Color',
      default: [],
      examples: Object.values(Color).map((color) => [color]),
    },
    glasses: {
      type: 'array',
      title: 'Glasses',
      items: {
        type: 'string',
        enum: Object.keys(paths.glasses.aliases),
      },
      default: [],
      examples: Object.keys(paths.glasses.aliases).map((part) => [part]),
    },
    glassesProbability: {
      $ref: '#/definitions/probability',
      title: 'Glasses Probability',
      default: 30,
    },
    mouth: {
      type: 'array',
      title: 'Mouth',
      items: {
        type: 'string',
        enum: Object.keys(paths.mouth.aliases),
      },
      default: [],
      examples: Object.keys(paths.mouth.aliases).map((part) => [part]),
    },
    nose: {
      type: 'array',
      title: 'Nose',
      items: {
        type: 'string',
        enum: Object.keys(paths.nose.aliases),
      },
      default: [],
      examples: Object.keys(paths.nose.aliases).map((part) => [part]),
    },
    shirtColor: {
      $ref: '#/definitions/colors',
      title: 'Shirt Color',
      default: [],
      examples: Object.keys(Color).map((color) => [color]),
    },
    shirt: {
      type: 'array',
      title: 'Shirt',
      items: {
        type: 'string',
        enum: Object.keys(paths.shirt.aliases),
      },
      default: [],
      examples: Object.keys(paths.shirt.aliases).map((part) => [part]),
    },
    hairColor: {
      $ref: '#/definitions/colors',
      title: 'Hair Color',
      default: [],
      examples: Object.keys(Color).map((color) => [color]),
    },
    hair: {
      type: 'array',
      title: 'Hair',
      items: {
        type: 'string',
        enum: Object.keys(paths.hair.aliases),
      },
      default: [],
      examples: Object.keys(paths.hair.aliases).map((part) => [part]),
    },
    hairProbability: {
      $ref: '#/definitions/probability',
      title: 'Hair Probability',
      default: 30,
    },
  },
});

export default schema;

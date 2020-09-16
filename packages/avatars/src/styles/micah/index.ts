import { IStyleSchema, IStyleCreate } from '../../interfaces';
import { svg, array } from '../../utils';
import { defaultSchema } from '../../schema';

import base from './base';
import earrings, { parts as earringParts } from './earrings';
import ears, { parts as earParts } from './ears';
import eyebrows, { parts as eyebrowParts } from './eyebrows';
import eyes, { parts as eyeParts } from './eyes';
import facialHair, { parts as facialHairParts } from './facialHair';
import glasses, { parts as glassesParts } from './glasses';
import mouth, { parts as mouthParts } from './mouth';
import nose, { parts as noseParts } from './nose';
import shirt, { parts as shirtParts } from './shirt';
import hair, { parts as hairParts } from './hair';
import { resolveReferences } from '../../utils/schema';

export const name = 'micah';
export const title = 'Avatar Illustration System';
export const creator = 'Micah Lanier';
export const source = 'https://www.figma.com/community/file/829741575478342595';
export const license = {
  name: 'CC BY 4.0',
  link: 'https://creativecommons.org/licenses/by/4.0/',
};

enum Color {
  apricot = '#F9C9B6',
  coast = '#AC6651',
  topaz = '#77311D',
  lavender = '#9287FF',
  sky = '#6BD9E9',
  salmon = '#FC909F',
  canary = '#F4D150',
  calm = '#E0DDFF',
  azure = '#D2EFF3',
  seashell = '#FFEDEF',
  mellow = '#FFEBA4',
  black = '#000000',
  white = '#FFFFFF',
}

export type Options = {
  baseColor: Color[];
  earringColor: Color[];
  earrings: Array<keyof typeof earringParts>;
  earringsProbability: number;
  ears: Array<keyof typeof earParts>;
  eyebrowColor: Color[];
  eyebrows: Array<keyof typeof eyebrowParts>;
  eyeColor: Color[];
  eyes: Array<keyof typeof eyeParts>;
  facialHair: Array<keyof typeof facialHairParts>;
  facialHairProbability: number;
  glassesColor: Color[];
  glasses: Array<keyof typeof glassesParts>;
  glassesProbability: number;
  mouth: Array<keyof typeof mouthParts>;
  nose: Array<keyof typeof noseParts>;
  shirtColor: Color[];
  shirt: Array<keyof typeof shirtParts>;
  hairColor: Color[];
  hair: Array<keyof typeof hairParts>;
  hairProbability: number;
};

export const schema: IStyleSchema = resolveReferences({
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
        enum: Object.keys(earringParts),
      },
      default: [],
      examples: Object.keys(earringParts).map((part) => [part]),
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
        enum: Object.keys(earParts),
      },
      default: [],
      examples: Object.keys(earParts).map((part) => [part]),
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
        enum: Object.keys(eyebrowParts),
      },
      default: [],
      examples: Object.keys(eyebrowParts).map((color) => [color]),
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
        enum: Object.keys(eyeParts),
      },
      default: [],
      examples: Object.keys(eyeParts).map((part) => [part]),
    },
    facialHair: {
      type: 'array',
      title: 'Facial Hair',
      items: {
        type: 'string',
        enum: Object.keys(facialHairParts),
      },
      default: [],
      examples: Object.keys(facialHairParts).map((part) => [part]),
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
        enum: Object.keys(glassesParts),
      },
      default: [],
      examples: Object.keys(glassesParts).map((part) => [part]),
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
        enum: Object.keys(mouthParts),
      },
      default: [],
      examples: Object.keys(mouthParts).map((part) => [part]),
    },
    nose: {
      type: 'array',
      title: 'Nose',
      items: {
        type: 'string',
        enum: Object.keys(noseParts),
      },
      default: [],
      examples: Object.keys(noseParts).map((part) => [part]),
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
        enum: Object.keys(shirtParts),
      },
      default: [],
      examples: Object.keys(shirtParts).map((part) => [part]),
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
        enum: Object.keys(hairParts),
      },
      default: [],
      examples: Object.keys(hairParts).map((part) => [part]),
    },
    hairProbability: {
      $ref: '#/definitions/probability',
      title: 'Hair Probability',
      default: 30,
    },
  },
});

export const create: IStyleCreate<Options> = (prng, options) => {
  let baseColor = prng.pick(array.applyAliases(options.baseColor, Color));

  const pickColor = (colors: string[]) => prng.pick(array.filter(array.applyAliases(colors, Color), baseColor, true));

  let earringColor = pickColor(options.earringColor);
  let eyebrowColor = pickColor(options.eyebrowColor);
  let eyeColor = pickColor(options.eyeColor);
  let glassesColor = pickColor(options.glassesColor);
  let shirtColor = pickColor(options.shirtColor);
  let hairColor = pickColor(options.hairColor);

  return {
    attributes: {
      viewBox: '0 0 639 639',
    },
    body: `
      ${svg.createGroup(shirt(prng, options, shirtColor), 105.94, 491.02)}
      ${
        prng.bool(options.earringsProbability) ? svg.createGroup(earrings(prng, options, earringColor), 163.11, 52) : ''
      }
      ${svg.createGroup(ears(prng, options), 158.07, 351.46)}
      ${svg.createGroup(nose(prng, options), 313.4, 283.21)}
      ${
        prng.bool(options.glassesProbability)
          ? svg.createGroup(glasses(prng, options, glassesColor), 188.34, 220.29)
          : ''
      }
      ${svg.createGroup(eyes(prng, options, eyeColor), 255.6, 233.74)}
      ${svg.createGroup(eyebrows(prng, options, eyebrowColor), 201.79, 205.15)}
      ${svg.createGroup(mouth(prng, options), 302.68, 341.36)}
      ${prng.bool(options.hairProbability) ? svg.createGroup(hair(prng, options, hairColor), 99.21, 52.13) : ''}
      ${prng.bool(options.facialHairProbability) ? svg.createGroup(facialHair(prng, options), 208.51, 244.34) : ''}
      ${svg.createGroup(base(baseColor), 151.34, 72.31)}
    `,
  };
};

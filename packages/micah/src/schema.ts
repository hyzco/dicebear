import type { JSONSchema7 } from 'json-schema';
import * as colors from './colors';
import * as paths from './paths';

type ColorName = keyof typeof colors;
type ColorNames = Record<ColorName, ColorName>;

const colorNames = Object.keys(colors).reduce<ColorNames>((result, name) => {
  result[name as ColorName] = name as ColorName;

  return result;
}, {} as ColorNames);

const colorsProperty: JSONSchema7 = {
  type: 'array',
  items: {
    oneOf: [
      {
        type: 'string',
        enum: Object.keys(colors),
      },
      {
        type: 'string',
        pattern: '^#([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{4}|[a-fA-F0-9]{3})+$',
      },
    ],
  },
  default: Object.keys(colors),
};

const probabilityProperty: JSONSchema7 = {
  type: 'number',
  minimum: 0,
  maximum: 100,
};

export const schema: JSONSchema7 = {
  title: 'Options',
  type: 'object',
  properties: {
    base: {
      type: 'array',
      title: 'Base',
      items: {
        type: 'string',
        enum: Object.keys(paths.base),
      },
      default: Object.keys(paths.base),
    },
    baseColor: {
      ...colorsProperty,
      title: 'Base Color',
      default: [colorNames.apricot, colorNames.coast, colorNames.topaz],
    },
    earrings: {
      type: 'array',
      title: 'Earrings',
      items: {
        type: 'string',
        enum: Object.keys(paths.earrings),
      },
      default: Object.keys(paths.earrings),
    },
    earringColor: {
      ...colorsProperty,
      title: 'Earring Color',
    },
    earringsProbability: {
      ...probabilityProperty,
      title: 'Earrings Probability',
      default: 30,
    },
    eyebrows: {
      type: 'array',
      title: 'Eyebrows',
      items: {
        type: 'string',
        enum: Object.keys(paths.eyebrows),
      },
      default: Object.keys(paths.eyebrows),
    },
    eyebrowColor: {
      ...colorsProperty,
      title: 'Eyebrow Color',
      default: [colorNames.black],
    },
    ears: {
      type: 'array',
      title: 'Ears',
      items: {
        type: 'string',
        enum: Object.keys(paths.ears),
      },
      default: Object.keys(paths.ears),
    },
    eyes: {
      type: 'array',
      title: 'Eyes',
      items: {
        type: 'string',
        enum: Object.keys(paths.eyes),
      },
      default: Object.keys(paths.eyes),
    },
    eyeColor: {
      ...colorsProperty,
      title: 'Eye Color',
      default: [colorNames.calm, colorNames.azure, colorNames.seashell, colorNames.mellow, colorNames.white],
    },
    facialHair: {
      type: 'array',
      title: 'Facial Hair',
      items: {
        type: 'string',
        enum: Object.keys(paths.facialHair),
      },
      default: Object.keys(paths.facialHair),
    },
    facialHairColor: {
      ...colorsProperty,
      title: 'Facial Hair Color',
      default: [colorNames.topaz],
    },
    facialHairProbability: {
      ...probabilityProperty,
      title: 'Facial Hair Probability',
      default: 10,
    },
    glasses: {
      type: 'array',
      title: 'Glasses',
      items: {
        type: 'string',
        enum: Object.keys(paths.glasses),
      },
      default: Object.keys(paths.glasses),
    },
    glassesColor: {
      ...colorsProperty,
      title: 'Glasses Color',
    },
    glassesProbability: {
      ...probabilityProperty,
      title: 'Glasses Probability',
      default: 30,
    },
    mouth: {
      type: 'array',
      title: 'Mouth',
      items: {
        type: 'string',
        enum: Object.keys(paths.mouth),
      },
      default: Object.keys(paths.mouth),
    },
    nose: {
      type: 'array',
      title: 'Nose',
      items: {
        type: 'string',
        enum: Object.keys(paths.nose),
      },
      default: Object.keys(paths.nose),
    },
    shirt: {
      type: 'array',
      title: 'Shirt',
      items: {
        type: 'string',
        enum: Object.keys(paths.shirt),
      },
      default: Object.keys(paths.shirt),
    },
    shirtColor: {
      ...colorsProperty,
      title: 'Shirt Color',
    },
    hair: {
      type: 'array',
      title: 'Hair',
      items: {
        type: 'string',
        enum: Object.keys(paths.hair),
      },
      default: Object.keys(paths.hair),
    },
    hairColor: {
      ...colorsProperty,
      title: 'Hair Color',
    },
    hairProbability: {
      ...probabilityProperty,
      title: 'Hair Probability',
      default: 100,
    },
  },
};

import { IStyleDefaultOptions, IStyleSchema, IStyleCreate } from '../../interfaces';
import { createGroup } from '../../utils';

import base from './base';
import earrings from './earrings';
import ears from './ears';
import eyebrows from './eyebrows';
import eyes from './eyes';
import facialHair from './facialHair';
import glasses from './glasses';
import mouth from './mouth';
import nose from './nose';
import shirt from './shirt';
import hair from './hair';

export const name = 'micah';
export const title = 'Avatar Illustration System';
export const creator = 'Micah Lanier';
export const source = 'https://www.figma.com/community/file/829741575478342595';
export const license = {
  name: 'CC BY 4.0',
  link: 'https://creativecommons.org/licenses/by/4.0/',
};

type Options = {
  earrings: Array<'hoop' | 'stud'>;
  earringsProbability: number;
  ears: Array<'attached' | 'detached'>;
  eyebrows: Array<'down' | 'eyelashesDown' | 'eyelashesUp' | 'up'>;
  eyes: Array<'eyes' | 'eyeshadow' | 'round' | 'smiling'>;
  facialHair: Array<'beard' | 'scruff'>;
  facialHairProbability: number;
  glasses: Array<'square' | 'round'>;
  glassesProbability: number;
  mouth: Array<'frown' | 'laughing' | 'nervous' | 'pucker' | 'sad' | 'smile' | 'smirk' | 'surprised'>;
  nose: Array<'round' | 'pointed' | 'curve'>;
  shirt: Array<'open' | 'crew' | 'collared'>;
  hair: Array<'dannyPhantom' | 'dougFunny' | 'fonze' | 'full' | 'mrClean' | 'mrT' | 'pixie' | 'turban'>;
  hairProbability: number;
};

export const defaultOptions: IStyleDefaultOptions<Options> = {
  earrings: [],
  earringsProbability: 30,
  ears: [],
  eyebrows: [],
  eyes: [],
  facialHair: [],
  facialHairProbability: 30,
  glasses: [],
  glassesProbability: 30,
  mouth: [],
  nose: [],
  shirt: [],
  hair: [],
  hairProbability: 90,
};

export const schema: IStyleSchema = {};

export const create: IStyleCreate<Options> = (prng, options) => {
  return {
    attributes: {
      viewBox: '0 0 639 639',
    },
    body: `
    ${createGroup(shirt(prng, options), 105.94, 491.02)}
    ${prng.bool(options.earringsProbability) ? createGroup(earrings(prng, options), 163.11, 52) : ''}
    ${createGroup(ears(prng, options), 158.07, 351.46)}
    ${createGroup(nose(prng, options), 313.4, 283.21)}
    ${prng.bool(options.glassesProbability) ? createGroup(glasses(prng, options), 188.34, 220.29) : ''}
    ${createGroup(eyes(prng, options), 255.6, 233.74)}
    ${createGroup(eyebrows(prng, options), 201.79, 205.15)}
    ${createGroup(mouth(prng, options), 302.68, 341.36)}
    ${prng.bool(options.hairProbability) ? createGroup(hair(prng, options), 99.21, 52.13) : ''}
    ${prng.bool(options.facialHairProbability) ? createGroup(facialHair(prng, options), 208.51, 244.34) : ''}
    ${createGroup(base(), 151.34, 72.31)}
    `,
  };
};

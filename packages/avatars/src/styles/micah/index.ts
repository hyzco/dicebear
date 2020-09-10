import { IStyleDefaultOptions, IStyleSchema, IStyleCreate } from '../../interfaces';
import { createGroup, filterByOption } from '../../utils';
import { filterBaseColor } from './utils';

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

type Colors = 'lavender' | 'sky' | 'salmon' | 'canary' | 'calm' | 'azure' | 'seashell' | 'mellow' | 'black' | 'white';

type Options = {
  baseColor: Colors[];
  earringColor: Colors[];
  earrings: Array<'hoop' | 'stud'>;
  earringsProbability: number;
  ears: Array<'attached' | 'detached'>;
  eyebrowColor: Colors[];
  eyebrows: Array<'down' | 'eyelashesDown' | 'eyelashesUp' | 'up'>;
  eyeColor: Colors[];
  eyes: Array<'eyes' | 'eyesShadow' | 'round' | 'smiling' | 'smilingShadow'>;
  facialHair: Array<'beard' | 'scruff'>;
  facialHairProbability: number;
  glassesColor: Colors[];
  glasses: Array<'square' | 'round'>;
  glassesProbability: number;
  mouth: Array<'frown' | 'laughing' | 'nervous' | 'pucker' | 'sad' | 'smile' | 'smirk' | 'surprised'>;
  nose: Array<'round' | 'pointed' | 'curve'>;
  shirtColor: Colors[];
  shirt: Array<'open' | 'crew' | 'collared'>;
  hairColor: Colors[];
  hair: Array<'dannyPhantom' | 'dougFunny' | 'fonze' | 'full' | 'mrClean' | 'mrT' | 'pixie' | 'turban'>;
  hairProbability: number;
};

export const defaultOptions: IStyleDefaultOptions<Options> = {
  baseColor: [],
  earringColor: [],
  earrings: [],
  earringsProbability: 30,
  ears: [],
  eyebrowColor: ['black'],
  eyebrows: [],
  eyeColor: [],
  eyes: [],
  facialHair: [],
  facialHairProbability: 30,
  glassesColor: [],
  glasses: [],
  glassesProbability: 30,
  mouth: [],
  nose: [],
  shirtColor: [],
  shirt: [],
  hairColor: [],
  hair: [],
  hairProbability: 90,
};

export const schema: IStyleSchema = {};

export const create: IStyleCreate<Options> = (prng, options) => {
  let colors = {
    apricot: '#F9C9B6',
    coast: '#AC6651',
    topaz: '#77311D',
    lavender: '#9287FF',
    sky: '#6BD9E9',
    salmon: '#FC909F',
    canary: '#F4D150',
    calm: '#E0DDFF',
    azure: '#D2EFF3',
    seashell: '#FFEDEF',
    mellow: '#FFEBA4',
    black: '#000000',
    white: '#FFFFFF',
  };

  let baseColor = prng.pick(filterByOption(options, 'baseColor', colors));
  let earringColor = prng.pick(filterBaseColor(filterByOption(options, 'earringColor', colors), baseColor));
  let eyebrowColor = prng.pick(filterBaseColor(filterByOption(options, 'eyebrowColor', colors), baseColor));
  let eyeColor = prng.pick(filterBaseColor(filterByOption(options, 'eyeColor', colors), baseColor));
  let glassesColor = prng.pick(filterBaseColor(filterByOption(options, 'glassesColor', colors), baseColor));
  let shirtColor = prng.pick(filterBaseColor(filterByOption(options, 'shirtColor', colors), baseColor));
  let hairColor = prng.pick(filterBaseColor(filterByOption(options, 'hairColor', colors), baseColor));

  return {
    attributes: {
      viewBox: '0 0 639 639',
    },
    body: `
      ${createGroup(shirt(prng, options, shirtColor), 105.94, 491.02)}
      ${prng.bool(options.earringsProbability) ? createGroup(earrings(prng, options, earringColor), 163.11, 52) : ''}
      ${createGroup(ears(prng, options), 158.07, 351.46)}
      ${createGroup(nose(prng, options), 313.4, 283.21)}
      ${prng.bool(options.glassesProbability) ? createGroup(glasses(prng, options, glassesColor), 188.34, 220.29) : ''}
      ${createGroup(eyes(prng, options, eyeColor), 255.6, 233.74)}
      ${createGroup(eyebrows(prng, options, eyebrowColor), 201.79, 205.15)}
      ${createGroup(mouth(prng, options), 302.68, 341.36)}
      ${prng.bool(options.hairProbability) ? createGroup(hair(prng, options, hairColor), 99.21, 52.13) : ''}
      ${prng.bool(options.facialHairProbability) ? createGroup(facialHair(prng, options), 208.51, 244.34) : ''}
      ${createGroup(base(baseColor), 151.34, 72.31)}
    `,
  };
};

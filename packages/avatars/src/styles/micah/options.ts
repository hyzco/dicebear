import Color from './colors';

import * as paths from './paths';

type Options = {
  baseColor: Color[];
  earringColor: Color[];
  earrings: Array<keyof typeof paths.earrings.aliases>;
  earringsProbability: number;
  ears: Array<keyof typeof paths.ears.aliases>;
  eyebrowColor: Color[];
  eyebrows: Array<keyof typeof paths.eyebrows.aliases>;
  eyeColor: Color[];
  eyes: Array<keyof typeof paths.eyes.aliases>;
  facialHair: Array<keyof typeof paths.facialHair.aliases>;
  facialHairProbability: number;
  glassesColor: Color[];
  glasses: Array<keyof typeof paths.glasses.aliases>;
  glassesProbability: number;
  mouth: Array<keyof typeof paths.mouth.aliases>;
  nose: Array<keyof typeof paths.nose.aliases>;
  shirtColor: Color[];
  shirt: Array<keyof typeof paths.shirt.aliases>;
  hairColor: Color[];
  hair: Array<keyof typeof paths.hair.aliases>;
  hairProbability: number;
};

export default Options;

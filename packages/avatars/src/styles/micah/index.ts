import { IStyleCreate } from '../../interfaces';
import { svg, array } from '../../utils';

import Color from './colors';
import type Options from './options';
import * as paths from './paths';

export const name = 'micah';
export const title = 'Avatar Illustration System';
export const creator = 'Micah Lanier';
export const source = 'https://www.figma.com/community/file/829741575478342595';
export const license = {
  name: 'CC BY 4.0',
  link: 'https://creativecommons.org/licenses/by/4.0/',
};

export { default as schema } from './schema';

export const create: IStyleCreate<Options> = (prng, options) => {
  const baseColor = prng.pick(
    array.alias({
      values: options.baseColor,
      aliases: Color,
    })
  );

  const pickColor = (colors: string[]) => {
    return prng.pick(
      array.filter({
        array: array.alias({
          values: colors,
          aliases: Color,
        }),
        values: [baseColor],
        preventEmpty: true,
      })
    );
  };

  const shirt = paths.shirt.create({
    prng,
    values: options.shirt,
    color: pickColor(options.shirtColor),
  });

  const earrings = paths.earrings.create({
    prng,
    values: options.earrings,
    color: pickColor(options.earringColor),
  });

  const ears = paths.ears.create({
    prng,
    values: options.ears,
  });

  const nose = paths.nose.create({
    prng,
    values: options.nose,
  });

  const glasses = paths.glasses.create({
    prng,
    values: options.glasses,
    color: pickColor(options.glassesColor),
  });

  const eyes = paths.eyes.create({
    prng,
    values: options.eyes,
    color: pickColor(options.eyeColor),
  });

  const eyebrows = paths.eyebrows.create({
    prng,
    values: options.eyebrows,
    color: pickColor(options.eyebrowColor),
  });

  const mouth = paths.mouth.create({
    prng,
    values: options.mouth,
  });

  const hair = paths.hair.create({
    prng,
    values: options.hair,
    color: pickColor(options.hairColor),
  });

  const facialHair = paths.facialHair.create({
    prng,
    values: options.facialHair,
  });

  const base = paths.base.create({
    color: baseColor,
  });

  return {
    attributes: {
      viewBox: '0 0 639 639',
    },
    body: `
      ${svg.createGroup(shirt, 105.94, 491.02)}
      ${prng.bool(options.earringsProbability) ? svg.createGroup(earrings, 163.11, 52) : ''}
      ${svg.createGroup(ears, 158.07, 351.46)}
      ${svg.createGroup(nose, 313.4, 283.21)}
      ${prng.bool(options.glassesProbability) ? svg.createGroup(glasses, 188.34, 220.29) : ''}
      ${svg.createGroup(eyes, 255.6, 233.74)}
      ${svg.createGroup(eyebrows, 201.79, 205.15)}
      ${svg.createGroup(mouth, 302.68, 341.36)}
      ${prng.bool(options.hairProbability) ? svg.createGroup(hair, 99.21, 52.13) : ''}
      ${prng.bool(options.facialHairProbability) ? svg.createGroup(facialHair, 208.51, 244.34) : ''}
      ${svg.createGroup(base, 151.34, 72.31)}
    `,
  };
};

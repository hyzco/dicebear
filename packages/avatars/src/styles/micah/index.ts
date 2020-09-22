import type { IStyleCreate } from '../../interfaces';
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
    color: baseColor,
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
      viewBox: '0 0 380 380',
      fill: 'none',
    },
    body: `
      ${svg.createGroup({ children: base, x: 90, y: 43 })}
      ${prng.bool(options.facialHairProbability) ? svg.createGroup({ children: facialHair, x: 124, y: 145.3 }) : ''}
      ${svg.createGroup({ children: mouth, x: 180, y: 203 })}
      ${svg.createGroup({ children: eyebrows, x: 120, y: 122 })}
      ${prng.bool(options.hairProbability) ? svg.createGroup({ children: hair, x: 59, y: 31 }) : ''}
      ${svg.createGroup({ children: eyes, x: 152, y: 139 })}
      ${prng.bool(options.glassesProbability) ? svg.createGroup({ children: glasses, x: 112, y: 131 }) : ''}
      ${svg.createGroup({ children: nose, x: 186.37, y: 168.42 })}
      ${svg.createGroup({ children: ears, x: 94, y: 174 })}
      ${prng.bool(options.earringsProbability) ? svg.createGroup({ children: earrings, x: 97, y: 199 }) : ''}
      ${svg.createGroup({ children: shirt, x: 63, y: 292 })}
    `,
  };
};

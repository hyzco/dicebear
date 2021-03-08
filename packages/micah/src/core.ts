import type { Style } from '@dicebear/core';
import { utils } from '@dicebear/core';
import type { Options } from './options';
import * as paths from './paths';
import * as colors from './colors';
import { schema } from './schema.js';

const style: Style<Options> = {
  meta: {
    title: 'Avatar Illustration System',
    creator: 'Micah Lanier',
    source: 'https://www.figma.com/community/file/829741575478342595',
    license: {
      name: 'CC BY 4.0',
      link: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    const pickColor = (values: string[], filter: string[] = []): string => {
      let result = values
        .map((val) => colors[val as keyof typeof colors] || val)
        .filter((val) => false === filter.includes(val));

      return result.length > 0 ? prng.pick(result) : values[0] || 'transparent';
    };

    const pickPath = <T>(paths: Record<string, T>, values: string[] = []): T | undefined => {
      let result = values.map((val) => paths[val]);

      return result.length > 0 ? prng.pick(result) : undefined;
    };

    const baseColor = pickColor(options.baseColor ?? []);
    const hairColor = pickColor(options.hairColor ?? [], [baseColor]);
    const shirtColor = pickColor(options.shirtColor ?? [], [baseColor]);
    const earringColor = pickColor(options.earringColor ?? [], [baseColor, hairColor]);
    const glassesColor = pickColor(options.glassesColor ?? [], [baseColor, hairColor]);
    const eyeColor = pickColor(options.eyeColor ?? [], [baseColor, glassesColor]);
    const eyebrowColor = pickColor(options.eyebrowColor ?? [], [baseColor, glassesColor, eyeColor]);
    const facialHairColor = pickColor(options.facialHairColor ?? [], [baseColor]);

    const shirt = pickPath(paths.shirt, options.shirt);
    const earrings = prng.bool(options.earringsProbability) && pickPath(paths.earrings, options.earrings);
    const ears = pickPath(paths.ears, options.ears);
    const nose = pickPath(paths.nose, options.nose);
    const glasses = prng.bool(options.glassesProbability) && pickPath(paths.glasses, options.glasses);
    const eyes = pickPath(paths.eyes, options.eyes);
    const eyebrows = pickPath(paths.eyebrows, options.eyebrows);
    const mouth = pickPath(paths.mouth, options.mouth);
    const hair = prng.bool(options.hairProbability) && pickPath(paths.hair, options.hair);
    const facialHair = prng.bool(options.facialHairProbability) && pickPath(paths.facialHair, options.facialHair);
    const base = pickPath(paths.base, options.base);

    return {
      attributes: {
        viewBox: '0 0 360 360',
        fill: 'none',
      },
      body: `
        ${base ? utils.svg.createGroup({ children: base(baseColor), x: 90, y: 43 }) : ''}
        ${facialHair ? utils.svg.createGroup({ children: facialHair(facialHairColor), x: 124, y: 145.3 }) : ''}
        ${mouth ? utils.svg.createGroup({ children: mouth('#000'), x: 180, y: 203 }) : ''}
        ${eyebrows ? utils.svg.createGroup({ children: eyebrows(eyebrowColor), x: 120, y: 122 }) : ''}
        ${hair ? utils.svg.createGroup({ children: hair(hairColor), x: 59, y: 31 }) : ''}
        ${eyes ? utils.svg.createGroup({ children: eyes(eyeColor), x: 152, y: 139 }) : ''}
        ${glasses ? utils.svg.createGroup({ children: glasses(glassesColor), x: 112, y: 131 }) : ''}
        ${nose ? utils.svg.createGroup({ children: nose('#000'), x: 186.37, y: 168.42 }) : ''}
        ${ears ? utils.svg.createGroup({ children: ears(baseColor), x: 94, y: 174 }) : ''}
        ${earrings ? utils.svg.createGroup({ children: earrings(earringColor), x: 97, y: 209 }) : ''}
        ${shirt ? utils.svg.createGroup({ children: shirt(shirtColor), x: 63, y: 292 }) : ''}
      `,
    };
  },
};

export default style;

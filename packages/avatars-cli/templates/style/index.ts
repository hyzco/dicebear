import type { Style } from '@dicebear/avatars';
import type { Options } from './options';
import * as paths from './paths';
import colors from './colors';
import schema from './schema';

const style: Style<Options> = {
  meta: {
    title: '{{uc_name}}',
    creator: '{{author_name}}',
    source: '',
    license: {
      name: 'CC BY 4.0',
      link: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  colors,
  create: ({ prng, options }) => {
    const pickColor = (values: string[]): string => {
      let result = values.map((val) => colors[val] || val);

      return result.length > 0 ? prng.pick(result) : 'transparent';
    };

    const pickPath = <T>(paths: Record<string, T>, values: string[] = []): T | undefined => {
      let result = values.map((val) => paths[val]);

      return result.length > 0 ? prng.pick(result) : undefined;
    };

    const shapeColor = pickColor(options.shapeColor);
    const shape = pickPath(paths.shape, options.shape);

    return {
      attributes: {
        viewBox: '0 0 100 100',
        fill: 'none',
      },
      body: `
        ${shape ? shape(shapeColor) : ''}
      `,
    };
  },
};

export default style;

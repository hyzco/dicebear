import { style, legacy } from '@dicebear/avatars';
import qrImage from 'qr-image';

type Options = {
  type?: 'qr';
  color?: string;
  correctionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export const defaultOptions: style.IStyleDefaultOptions<Options> = {};
export const schema: style.IstyleSchema = {};
export const create: style.IStyleCreate<Options> = (prng, options = {}) => {
  let svg = qrImage
    .imageSync(prng.seed, {
      type: 'svg',
      ec_level: options.correctionLevel,
      margin: 0,
    })
    .toString();

  if (options.color) {
    svg = svg.replace('<path ', `<path fill="${options.color}" `);
  }

  return svg;
};

export default legacy.createStyleDefault({
  defaultOptions,
  schema,
  create,
});

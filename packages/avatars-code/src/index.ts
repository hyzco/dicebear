import { style, legacy } from '@dicebear/avatars';
import * as QRCode from 'qrcode-svg';

type Options = {
  type?: 'qr';
  color?: string;
  correctionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export const defaultOptions: style.IStyleDefaultOptions<Options> = {};
export const schema: style.IstyleSchema = {};
export const create: style.IStyleCreate<Options> = (prng, options = {}) => {
  return new QRCode({
    content: prng.seed,
    color: options.color,
    ecl: options.correctionLevel,
  }).svg();
};

export default legacy.createStyleDefault({
  defaultOptions,
  schema,
  create,
});

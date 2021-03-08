import Random from '@dicebear/core/lib/random';
// @ts-ignore
import jdenticon from 'jdenticon';

type Options = {
  hues?: number[];
  colorLightness?: [number, number];
  grayscaleLightness?: [number, number];
  colorSaturation?: number;
  grayscaleSaturation?: number;
};

export default function (random: Random, options: Options = {}) {
  jdenticon.config = {
    hues: options.hues,
    lightness: {
      color: options.colorLightness,
      grayscale: options.grayscaleLightness,
    },
    saturation: {
      color: options.colorSaturation,
      grayscale: options.grayscaleSaturation,
    },
  };

  return jdenticon.toSvg(random.seed, 50, 0).replace('width="50"', '').replace('height="50"', '');
}

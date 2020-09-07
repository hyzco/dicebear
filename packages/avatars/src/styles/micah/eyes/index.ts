import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import smiling from './smiling';
import eyes from './eyes';
import eyeshadow from './eyeshadow';
import round from './round';

export default <O>(prng: IPrng, options: IOptions<O>) =>
  prng.pick(
    filterByOption(options, 'eyes', {
      smiling,
      eyes,
      eyeshadow,
      round,
    })
  )();

import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import collared from './collared';
import crew from './crew';
import open from './open';

export const parts = { collared, crew, open };

export default <O>(prng: IPrng, options: IOptions<O>, shirtColor: string) =>
  prng.pick(filterByOption(options, 'ears', parts))(shirtColor);

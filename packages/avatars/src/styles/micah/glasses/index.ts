import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import round from './round';
import square from './square';

export const parts = { round, square };

export default <O>(prng: IPrng, options: IOptions<O>, glassesColor: string) =>
  prng.pick(filterByOption(options, 'ears', parts))(glassesColor);

import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import round from './round';
import square from './square';

export default <O>(prng: IPrng, options: IOptions<O>) =>
  prng.pick(filterByOption(options, 'ears', { round, square }))();

import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import attached from './attached';
import detached from './detached';

export default <O>(options: IOptions<O>, prng: IPrng) =>
  prng.pick(filterByOption(options, 'ears', { attached, detached }))();

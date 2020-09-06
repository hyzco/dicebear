import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import beard from './beard';
import scruff from './scruff';

export default <O>(options: IOptions<O>, prng: IPrng) =>
  prng.pick(filterByOption(options, 'ears', { beard, scruff }))();

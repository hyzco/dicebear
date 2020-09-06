import attached from './attached';
import detached from './detached';
import { filterByOption } from '../../../utils';
import type { IOptions, IPrng } from '../../../interfaces';

export default <O>(options: IOptions<O>, prng: IPrng) =>
  prng.pick(filterByOption(options, 'ears', { attached, detached }))();

import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import attached from './attached';
import detached from './detached';

export const parts = { attached, detached };

export default <O>(prng: IPrng, options: IOptions<O>) => prng.pick(filterByOption(options, 'ears', parts))();

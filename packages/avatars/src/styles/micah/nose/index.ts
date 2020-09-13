import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import curve from './curve';
import pointed from './pointed';
import round from './round';

export const parts = { curve, pointed, round };

export default <O>(prng: IPrng, options: IOptions<O>) => prng.pick(filterByOption(options, 'ears', parts))();

import type { IOptions, IPrng } from '../../../interfaces';
import { getValuesByOption } from '../../../utils';

import beard from './beard';
import scruff from './scruff';

export const parts = { beard, scruff };

export default <O>(prng: IPrng, options: IOptions<O>) => prng.pick(getValuesByOption(options, 'ears', parts))();

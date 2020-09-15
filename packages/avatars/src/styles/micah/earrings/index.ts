import type { IOptions, IPrng } from '../../../interfaces';
import { getValuesByOption } from '../../../utils';

import hoop from './hoop';
import stud from './stud';

export const parts = { hoop, stud };

export default <O>(prng: IPrng, options: IOptions<O>, earringColor: string) =>
  prng.pick(getValuesByOption(options, 'earrings', parts))(earringColor);

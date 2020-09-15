import type { IOptions, IPrng } from '../../../interfaces';
import { getValuesByOption } from '../../../utils';

import eyelashesDown from './eyelashesDown';
import eyelashesUp from './eyelashesUp';
import down from './down';
import up from './up';

export const parts = {
  eyelashesDown,
  eyelashesUp,
  down,
  up,
};

export default <O>(prng: IPrng, options: IOptions<O>, eyebrowColor: string) =>
  prng.pick(getValuesByOption(options, 'eyebrows', parts))(eyebrowColor);

import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import eyelashesDown from './eyelashesDown';
import eyelashesUp from './eyelashesUp';
import down from './down';
import up from './up';

export default <O>(prng: IPrng, options: IOptions<O>, eyebrowColor: string) =>
  prng.pick(
    filterByOption(options, 'eyebrows', {
      eyelashesDown,
      eyelashesUp,
      down,
      up,
    })
  )(eyebrowColor);

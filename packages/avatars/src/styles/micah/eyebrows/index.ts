import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import eyelashesDown from './eyelashesDown';
import eyelashesUp from './eyelashesUp';
import down from './down';
import up from './up';

export default <O>(options: IOptions<O>, prng: IPrng) =>
  prng.pick(
    filterByOption(options, 'eyebrows', {
      eyelashesDown,
      eyelashesUp,
      down,
      up,
    })
  )();

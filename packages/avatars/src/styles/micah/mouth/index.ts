import type { IOptions, IPrng } from '../../../interfaces';
import { filterByOption } from '../../../utils';

import laughing from './laughing';
import nervous from './nervous';
import pucker from './pucker';
import sad from './sad';
import smile from './smile';
import smirk from './smirk';
import surprised from './surprised';
import frown from './frown';

export default <O>(prng: IPrng, options: IOptions<O>) =>
  prng.pick(
    filterByOption(options, 'mouth', {
      laughing,
      nervous,
      pucker,
      sad,
      smile,
      smirk,
      surprised,
      frown,
    })
  )();

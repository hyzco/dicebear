import type { IOptions, IPrng } from '../../../interfaces';
import { getValuesByOption } from '../../../utils';

import pixie from './pixie';
import dannyPhantom from './dannyPhantom';
import dougFunny from './dougFunny';
import fonze from './fonze';
import full from './full';
import mrClean from './mrClean';
import mrT from './mrT';
import turban from './turban';

export const parts = {
  pixie,
  dannyPhantom,
  dougFunny,
  fonze,
  full,
  mrClean,
  mrT,
  turban,
};

export default <O>(prng: IPrng, options: IOptions<O>, hairColor: string) =>
  prng.pick(getValuesByOption(options, 'tops', parts))(hairColor);

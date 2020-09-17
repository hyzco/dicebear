import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import pixie from './pixie';
import dannyPhantom from './dannyPhantom';
import dougFunny from './dougFunny';
import fonze from './fonze';
import full from './full';
import mrClean from './mrClean';
import mrT from './mrT';
import turban from './turban';

export const aliases = {
  pixie,
  dannyPhantom,
  dougFunny,
  fonze,
  full,
  mrClean,
  mrT,
  turban,
};

type Props = {
  prng: IPrng;
  values: string[];
  color: string;
};

export const create = ({ values, color, prng }: Props) =>
  prng.pick(
    array.alias({
      values,
      aliases,
    })
  )({ color });

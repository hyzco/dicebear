import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import laughing from './laughing';
import nervous from './nervous';
import pucker from './pucker';
import sad from './sad';
import smile from './smile';
import smirk from './smirk';
import surprised from './surprised';
import frown from './frown';

export const aliases = {
  laughing,
  nervous,
  pucker,
  sad,
  smile,
  smirk,
  surprised,
  frown,
};

type Props = {
  prng: IPrng;
  values: string[];
};

export const create = ({ values, prng }: Props) =>
  prng.pick(
    array.alias({
      values,
      aliases,
    })
  )();

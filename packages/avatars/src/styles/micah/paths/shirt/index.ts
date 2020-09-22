import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import collared from './collared';
import crew from './crew';
import open from './open';

export const aliases = {
  collared,
  crew,
  open,
};

type Props = {
  prng: IPrng;
  values: string[];
  color: string;
};

export const create = ({ values, color, prng }: Props) => {
  return prng.pick(
    array.alias({
      values,
      aliases,
    })
  )({ color });
};

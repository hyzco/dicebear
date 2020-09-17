import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import round from './round';
import square from './square';

export const aliases = {
  round,
  square,
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

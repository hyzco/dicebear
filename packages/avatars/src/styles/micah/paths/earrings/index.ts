import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import hoop from './hoop';
import stud from './stud';

export const aliases = {
  hoop,
  stud,
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

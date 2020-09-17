import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import attached from './attached';
import detached from './detached';

export const aliases = {
  attached,
  detached,
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

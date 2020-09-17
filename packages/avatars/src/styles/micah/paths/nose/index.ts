import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import curve from './curve';
import pointed from './pointed';
import round from './round';

export const aliases = {
  curve,
  pointed,
  round,
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

import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import eyelashesDown from './eyelashesDown';
import eyelashesUp from './eyelashesUp';
import down from './down';
import up from './up';

export const aliases = {
  eyelashesDown,
  eyelashesUp,
  down,
  up,
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

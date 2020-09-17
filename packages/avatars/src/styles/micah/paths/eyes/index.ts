import type { IPrng } from '../../../../interfaces';
import { array } from '../../../../utils';

import smiling from './smiling';
import smilingShadow from './smilingShadow';
import eyes from './eyes';
import eyesShadow from './eyesShadow';
import round from './round';

export const aliases = {
  smiling,
  smilingShadow,
  eyes,
  eyesShadow,
  round,
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

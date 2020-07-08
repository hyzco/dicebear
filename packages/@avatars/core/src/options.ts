import * as expr from './expr';
import * as prng from './prng';
import { IExprCollection } from './expr/interfaces';

export type IDefaultOptions = {
  seed?: string;
  radius?: number;
  r?: number;
  dataUri?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  background?: string;
  b?: string;
};

export type IOptions<O extends {}> = O & IDefaultOptions;

export function process<O extends {}>(options: IExprCollection<IOptions<O>>): IOptions<O> {
  let prngInstance = prng.create(typeof options.seed === 'string' ? options.seed : '');

  // Apply aliases
  options = {
    ...{
      radius: options.r,
      width: options.w,
      height: options.h,
      margin: options.m,
      background: options.b,
    },
    ...options,
  };

  return expr.resolve(options, prngInstance);
}

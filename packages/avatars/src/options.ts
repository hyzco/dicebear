import { IOptions } from './interfaces';

export function applyAliases<O extends {}>(options: IOptions<O>): IOptions<O> {
  return {
    ...{
      radius: options.r,
      width: options.w,
      height: options.h,
      margin: options.m,
      backgroundColor: options.b,
    },
    ...options,
  };
}

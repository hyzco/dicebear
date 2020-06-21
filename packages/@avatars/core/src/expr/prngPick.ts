import type { IExpression, IExpressionResolved } from '../expr';
import type { IPrng } from '../prng';

export type IPrngPickExpressionArguments<T> = [Array<IExpression<T>>];
export type IPrngPickExpression<T> = ['$prng.pick', IPrngPickExpressionArguments<T>];

export function prngPick<T>(...args: IPrngPickExpressionArguments<T>): IPrngPickExpression<T> {
  return ['$prng.pick', args];
}

export function resolvePrngPick<T>(
  args: IPrngPickExpressionArguments<T>,
  prng: IPrng
): IExpressionResolved<IPrngPickExpression<T>> {
  if (Array.isArray(args[0])) {
    return prng.pick(args[0]) as T;
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

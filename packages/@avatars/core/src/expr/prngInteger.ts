import type { IExpression, IExpressionResolved } from '../expr';
import type { IPrng } from '../prng';

export type IPrngIntegerExpressionArguments = [IExpression<number>, IExpression<number>];
export type IPrngIntegerExpression = ['$prng.integer', IPrngIntegerExpressionArguments];

export function prngInteger(...args: IPrngIntegerExpressionArguments): IPrngIntegerExpression {
  return ['$prng.integer', args];
}

export function resolvePrngInteger(
  args: IPrngIntegerExpressionArguments,
  prng: IPrng
): IExpressionResolved<IPrngIntegerExpression> {
  if (typeof args[0] === 'number' && typeof args[1] === 'number') {
    return prng.integer(args[0], args[1]);
  }

  throw new Error('Invalid arguments for $prng.integer.');
}

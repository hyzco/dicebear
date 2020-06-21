import type { IExpression, IExpressionResolved } from '../expr';
import type { IPrng } from '../prng';

export type IPrngBoolExpressionArguments = [IExpression<number | undefined>];
export type IPrngBoolExpression = ['$prng.bool', IPrngBoolExpressionArguments];

export function prngBool(...args: IPrngBoolExpressionArguments): IPrngBoolExpression {
  return ['$prng.bool', args];
}

export function resolvePrngBool(
  args: IPrngBoolExpressionArguments,
  prng: IPrng
): IExpressionResolved<IPrngBoolExpression> {
  if (args[0] === undefined || typeof args[0] === 'number') {
    return prng.bool(args[0] as number | undefined);
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

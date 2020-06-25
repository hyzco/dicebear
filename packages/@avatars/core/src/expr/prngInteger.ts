import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IPrngIntegerExpressionArguments<O> = [IExpression<O, number>, IExpression<O, number>];
export type IPrngIntegerExpression<O> = ['$prng.integer', IPrngIntegerExpressionArguments<O>];

export function prngInteger<O>(...args: IPrngIntegerExpressionArguments<O>): IPrngIntegerExpression<O> {
  return ['$prng.integer', args];
}

export function resolvePrngInteger<O>(
  context: IResolveContext<O>,
  args: IPrngIntegerExpressionArguments<O>
): IExpressionResolved<IPrngIntegerExpression<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return context.prng.integer(arg0, arg1);
  }

  throw new Error('Invalid arguments for $prng.integer.');
}

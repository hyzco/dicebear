import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IPrngBoolExpressionArguments<O> = [IExpression<O, number | undefined>];
export type IPrngBoolExpression<O> = ['$prng.bool', IPrngBoolExpressionArguments<O>];

export function prngBool<O>(...args: IPrngBoolExpressionArguments<O>): IPrngBoolExpression<O> {
  return ['$prng.bool', args];
}

export function resolvePrngBool<O>(
  context: IResolveContext<O>,
  args: IPrngBoolExpressionArguments<O>
): IExpressionResolved<IPrngBoolExpression<O>> {
  let arg0 = context.resolve(args[0]);

  if (arg0 === undefined || typeof arg0 === 'number') {
    return context.prng.bool(arg0);
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

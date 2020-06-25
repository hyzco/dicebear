import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IPrngPickExpressionArguments<O, T> = [Array<IExpression<O, T>>];
export type IPrngPickExpression<O, T> = ['$prng.pick', IPrngPickExpressionArguments<O, T>];

export function prngPick<O, T>(...args: IPrngPickExpressionArguments<O, T>): IPrngPickExpression<O, T> {
  return ['$prng.pick', args];
}

export function resolvePrngPick<O, T>(
  context: IResolveContext<O>,
  args: IPrngPickExpressionArguments<O, T>
): IExpressionResolved<IPrngPickExpression<O, T>> {
  let arg0 = args[0];

  if (Array.isArray(arg0)) {
    arg0 = arg0.map((v) => context.resolve(v));

    return context.prng.pick(args[0]) as T;
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

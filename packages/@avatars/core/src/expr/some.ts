import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type ISomeExpressionArguments<O> = [Array<IExpression<O, boolean>>];
export type ISomeExpression<O> = ['$some', ISomeExpressionArguments<O>];

export function some<O>(...args: ISomeExpressionArguments<O>): ISomeExpression<O> {
  return ['$some', args];
}

export function resolveSome<O>(
  context: IResolveContext<O>,
  args: ISomeExpressionArguments<O>
): IExpressionResolved<ISomeExpression<O>> {
  if (Array.isArray(args[0])) {
    return args[0].some((v) => context.resolve(v));
  }

  throw new Error('Invalid arguments for $some.');
}

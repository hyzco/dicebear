import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IEveryExpressionArguments<O> = [Array<IExpression<O, boolean>>];
export type IEveryExpression<O> = ['$every', IEveryExpressionArguments<O>];

export function every<O>(...args: IEveryExpressionArguments<O>): IEveryExpression<O> {
  return ['$every', args];
}

export function resolveEvery<O>(
  context: IResolveContext<O>,
  args: IEveryExpressionArguments<O>
): IExpressionResolved<IEveryExpression<O>> {
  if (Array.isArray(args[0])) {
    return args[0].every((v) => context.resolve(v));
  }

  throw new Error('Invalid arguments for $every.');
}

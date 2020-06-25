import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IIsExpressionArguments<O, T> = [IExpression<O, T>, IExpression<O, T>];
export type IIsExpression<O, T> = ['$is', IIsExpressionArguments<O, T>];

export function is<O, T>(...args: IIsExpressionArguments<O, T>): IIsExpression<O, T> {
  return ['$is', args];
}

export function resolveIs<O, T>(
  context: IResolveContext<O>,
  args: IIsExpressionArguments<O, T>
): IExpressionResolved<IIsExpression<O, T>> {
  return context.resolve(args[0]) === context.resolve(args[1]);
}

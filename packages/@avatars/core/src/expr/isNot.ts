import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IIsNotExpressionArguments<O, T> = [IExpression<O, T>, IExpression<O, T>];
export type IIsNotExpression<O, T> = ['$isNot', IIsNotExpressionArguments<O, T>];

export function isNot<O, T>(...args: IIsNotExpressionArguments<O, T>): IIsNotExpression<O, T> {
  return ['$isNot', args];
}

export function resolveIsNot<O, T>(
  context: IResolveContext<O>,
  args: IIsNotExpressionArguments<O, T>
): IExpressionResolved<IIsNotExpression<O, T>> {
  return context.resolve(args[0]) !== context.resolve(args[1]);
}

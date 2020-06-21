import type { IExpression, IExpressionResolved } from '../expr';

export type IIsExpressionArguments<T> = [IExpression<T>, IExpression<T>];
export type IIsExpression<T> = ['$is', IIsExpressionArguments<T>];

export function is<T>(...args: IIsExpressionArguments<T>): IIsExpression<T> {
  return ['$is', args];
}

export function resolveIs<T>(args: IIsExpressionArguments<T>): IExpressionResolved<IIsExpression<T>> {
  return args[0] === args[1];
}

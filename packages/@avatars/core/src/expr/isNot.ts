import type { IExpression, IExpressionResolved } from '../expr';

export type IIsNotExpressionArguments<T> = [IExpression<T>, IExpression<T>];
export type IIsNotExpression<T> = ['$isNot', IIsNotExpressionArguments<T>];

export function isNot<T>(...args: IIsNotExpressionArguments<T>): IIsNotExpression<T> {
  return ['$isNot', args];
}

export function resolveIsNot<T>(args: IIsNotExpressionArguments<T>): IExpressionResolved<IIsNotExpression<T>> {
  return args[0] !== args[1];
}

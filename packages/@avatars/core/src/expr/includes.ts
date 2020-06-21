import type { IExpression, IExpressionResolved } from '../expr';

export type IIncludesExpressionArguments<T> = [IExpression<T>, Array<IExpression<T>>];
export type IIncludesExpression<T> = ['$includes', IIncludesExpressionArguments<T>];

export function includes<T>(...args: IIncludesExpressionArguments<T>): IIncludesExpression<T> {
  return ['$includes', args];
}

export function resolveIncludes<T>(args: IIncludesExpressionArguments<T>): IExpressionResolved<IIncludesExpression<T>> {
  if (args[0] && Array.isArray(args[1])) {
    return args[1].includes(args[0]);
  }

  throw new Error('Invalid arguments for $includes.');
}

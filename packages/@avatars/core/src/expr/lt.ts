import type { IExpression, IExpressionResolved } from '../expr';

export type ILtExpressionArguments = [IExpression<number>, IExpression<number>];
export type ILtExpression = ['$lt', ILtExpressionArguments];

export function lt(...args: ILtExpressionArguments): ILtExpression {
  return ['$lt', args];
}

export function resolveLt(args: ILtExpressionArguments): IExpressionResolved<ILtExpression> {
  if (typeof args[0] === 'number' && typeof args[0] === 'number') {
    return args[0] < args[1];
  }

  throw new Error('Invalid arguments for $lt.');
}

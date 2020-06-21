import type { IExpression, IExpressionResolved } from '../expr';

export type IGtExpressionArguments = [IExpression<number>, IExpression<number>];
export type IGtExpression = ['$gt', IGtExpressionArguments];

export function gt(...args: IGtExpressionArguments): IGtExpression {
  return ['$gt', args];
}

export function resolveGt(args: IGtExpressionArguments): IExpressionResolved<IGtExpression> {
  if (typeof args[0] === 'number' && typeof args[0] === 'number') {
    return args[0] > args[1];
  }

  throw new Error('Invalid arguments for $gt.');
}

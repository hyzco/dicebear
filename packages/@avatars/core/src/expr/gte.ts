import type { IExpression, IExpressionResolved } from '../expr';

export type IGteExpressionArguments = [IExpression<number>, IExpression<number>];
export type IGteExpression = ['$gte', IGteExpressionArguments];

export function gte(...args: IGteExpressionArguments): IGteExpression {
  return ['$gte', args];
}

export function resolveGte(args: IGteExpressionArguments): IExpressionResolved<IGteExpression> {
  if (typeof args[0] === 'number' && typeof args[1] === 'number') {
    return args[0] >= args[1];
  }

  throw new Error('Invalid arguments for $gte.');
}

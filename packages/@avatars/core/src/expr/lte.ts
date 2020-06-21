import type { IExpression, IExpressionResolved } from '../expr';

export type ILteExpressionArguments = [IExpression<number>, IExpression<number>];
export type ILteExpression = ['$lte', ILteExpressionArguments];

export function lte(...args: ILteExpressionArguments): ILteExpression {
  return ['$lte', args];
}

export function resolveLte(args: ILteExpressionArguments): IExpressionResolved<ILteExpression> {
  if (typeof args[0] === 'number' && typeof args[0] === 'number') {
    return args[0] <= args[1];
  }

  throw new Error('Invalid arguments for $lte.');
}

import type { IExpression, IExpressionResolved } from '../expr';

export type ISomeExpressionArguments = [Array<IExpression<boolean>>];
export type ISomeExpression = ['$some', ISomeExpressionArguments];

export function some(...args: ISomeExpressionArguments): ISomeExpression {
  return ['$some', args];
}

export function resolveSome(args: ISomeExpressionArguments): IExpressionResolved<ISomeExpression> {
  if (Array.isArray(args[0])) {
    return args[0].some((v) => v);
  }

  throw new Error('Invalid arguments for $some.');
}

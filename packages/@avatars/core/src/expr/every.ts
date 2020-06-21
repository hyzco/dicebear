import type { IExpression, IExpressionResolved } from '../expr';

export type IEveryExpressionArguments = [Array<IExpression<boolean>>];
export type IEveryExpression = ['$every', IEveryExpressionArguments];

export function every(...args: IEveryExpressionArguments): IEveryExpression {
  return ['$every', args];
}

export function resolveEvery(args: IEveryExpressionArguments): IExpressionResolved<IEveryExpression> {
  if (Array.isArray(args[0])) {
    return args[0].every((v) => v);
  }

  throw new Error('Invalid arguments for $every.');
}

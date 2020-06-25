import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type ILtExpressionArguments<O> = [IExpression<O, number>, IExpression<O, number>];
export type ILtExpression<O> = ['$lt', ILtExpressionArguments<O>];

export function lt<O>(...args: ILtExpressionArguments<O>): ILtExpression<O> {
  return ['$lt', args];
}

export function resolveLt<O>(
  context: IResolveContext<O>,
  args: ILtExpressionArguments<O>
): IExpressionResolved<ILtExpression<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return arg0 < arg1;
  }

  throw new Error('Invalid arguments for $lt.');
}

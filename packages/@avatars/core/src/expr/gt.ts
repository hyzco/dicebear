import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IGtExpressionArguments<O> = [IExpression<O, number>, IExpression<O, number>];
export type IGtExpression<O> = ['$gt', IGtExpressionArguments<O>];

export function gt<O>(...args: IGtExpressionArguments<O>): IGtExpression<O> {
  return ['$gt', args];
}

export function resolveGt<O>(
  context: IResolveContext<O>,
  args: IGtExpressionArguments<O>
): IExpressionResolved<IGtExpression<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return arg0 > arg1;
  }

  throw new Error('Invalid arguments for $gt.');
}

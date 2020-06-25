import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type ILteExpressionArguments<O> = [IExpression<O, number>, IExpression<O, number>];
export type ILteExpression<O> = ['$lte', ILteExpressionArguments<O>];

export function lte<O>(...args: ILteExpressionArguments<O>): ILteExpression<O> {
  return ['$lte', args];
}

export function resolveLte<O>(
  context: IResolveContext<O>,
  args: ILteExpressionArguments<O>
): IExpressionResolved<ILteExpression<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return arg0 <= arg1;
  }

  throw new Error('Invalid arguments for $lte.');
}

import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IGteExpressionArguments<O> = [IExpression<O, number>, IExpression<O, number>];
export type IGteExpression<O> = ['$gte', IGteExpressionArguments<O>];

export function gte<O>(...args: IGteExpressionArguments<O>): IGteExpression<O> {
  return ['$gte', args];
}

export function resolveGte<O>(
  context: IResolveContext<O>,
  args: IGteExpressionArguments<O>
): IExpressionResolved<IGteExpression<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return arg0 >= arg1;
  }

  throw new Error('Invalid arguments for $gte.');
}

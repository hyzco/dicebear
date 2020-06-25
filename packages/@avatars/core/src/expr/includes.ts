import type { IExpression, IExpressionResolved, IResolveContext } from '../expr';

export type IIncludesExpressionArguments<O, T> = [IExpression<O, T>, Array<IExpression<O, T>>];
export type IIncludesExpression<O, T> = ['$includes', IIncludesExpressionArguments<O, T>];

export function includes<O, T>(...args: IIncludesExpressionArguments<O, T>): IIncludesExpression<O, T> {
  return ['$includes', args];
}

export function resolveIncludes<O, T>(
  context: IResolveContext<O>,
  args: IIncludesExpressionArguments<O, T>
): IExpressionResolved<IIncludesExpression<O, T>> {
  let arg0 = context.resolve(args[0]);

  if (arg0 && Array.isArray(args[1])) {
    let arg1 = args[1].map((v) => context.resolve(v));

    return arg1.includes(arg0);
  }

  throw new Error('Invalid arguments for $includes.');
}

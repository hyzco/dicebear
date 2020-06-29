import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O, T> = IExprBase<O, T>[];
export type IExpr<O, T> = IExprArgs<O, T>;

export function create<O, T>(...args: IExprArgs<O, T>): IExpr<O, T> {
  return args;
}

export function resolve<O, T>(context: IExprContext<O>, args: IExprArgs<O, T>): IExprResolved<IExpr<O, T>> {
  let resolvedValues: Array<IExprResolved<T>> = [];

  args.forEach((v) => {
    resolvedValues.push(context.resolve(v));
  });

  return context.prng.pick(resolvedValues) as IExprResolved<IExpr<O, T>>;
}

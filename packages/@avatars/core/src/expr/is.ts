import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O, T> = [IExprBase<O, T>, IExprBase<O, T>];
export type IExpr<O, T> = ['$is', IExprArgs<O, T>];

export function create<O, T>(...args: IExprArgs<O, T>): IExpr<O, T> {
  return ['$is', args];
}

export function resolve<O, T>(context: IExprContext<O>, args: IExprArgs<O, T>): IExprResolved<IExpr<O, T>> {
  return context.resolve(args[0]) === context.resolve(args[1]);
}

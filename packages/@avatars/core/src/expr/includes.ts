import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O, T> = [IExprBase<O, T>, Array<IExprBase<O, T>>];
export type IExpr<O, T> = ['$includes', IExprArgs<O, T>];

export function create<O, T>(...args: IExprArgs<O, T>): IExpr<O, T> {
  return ['$includes', args];
}

export function resolve<O, T>(context: IExprContext<O>, args: IExprArgs<O, T>): IExprResolved<IExpr<O, T>> {
  let arg0 = context.resolve(args[0]);

  if (arg0 && Array.isArray(args[1])) {
    let arg1 = args[1].map((v) => context.resolve(v));

    return arg1.includes(arg0);
  }

  throw new Error('Invalid arguments for $includes.');
}

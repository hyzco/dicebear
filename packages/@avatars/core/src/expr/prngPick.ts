import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O, T> = [Array<IExprBase<O, T>>];
export type IExpr<O, T> = ['$prng.pick', IExprArgs<O, T>];

export function create<O, T>(...args: IExprArgs<O, T>): IExpr<O, T> {
  return ['$prng.pick', args];
}

export function resolve<O, T>(context: IExprContext<O>, args: IExprArgs<O, T>): IExprResolved<IExpr<O, T>> {
  let arg0 = args[0];

  if (Array.isArray(arg0)) {
    arg0 = arg0.map((v) => context.resolve(v));

    return context.prng.pick(args[0]) as T;
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

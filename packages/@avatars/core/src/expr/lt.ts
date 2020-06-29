import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O> = [IExprBase<O, number>, IExprBase<O, number>];
export type IExpr<O> = ['$lt', IExprArgs<O>];

export function create<O>(...args: IExprArgs<O>): IExpr<O> {
  return ['$lt', args];
}

export function resolve<O>(context: IExprContext<O>, args: IExprArgs<O>): IExprResolved<IExpr<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return arg0 < arg1;
  }

  throw new Error('Invalid arguments for $lt.');
}

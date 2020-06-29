import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O> = [IExprBase<O, number>, IExprBase<O, number>];
export type IExpr<O> = ['$prng.integer', IExprArgs<O>];

export function create<O>(...args: IExprArgs<O>): IExpr<O> {
  return ['$prng.integer', args];
}

export function resolve<O>(context: IExprContext<O>, args: IExprArgs<O>): IExprResolved<IExpr<O>> {
  let arg0 = context.resolve(args[0]);
  let arg1 = context.resolve(args[1]);

  if (typeof arg0 === 'number' && typeof arg1 === 'number') {
    return context.prng.integer(arg0, arg1);
  }

  throw new Error('Invalid arguments for $prng.integer.');
}

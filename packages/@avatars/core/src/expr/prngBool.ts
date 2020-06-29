import type { IExpr as IExprBase, IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O> = [IExprBase<O, number | undefined>];
export type IExpr<O> = ['$prng.bool', IExprArgs<O>];

export function create<O>(...args: IExprArgs<O>): IExpr<O> {
  return ['$prng.bool', args];
}

export function resolve<O>(context: IExprContext<O>, args: IExprArgs<O>): IExprResolved<IExpr<O>> {
  let arg0 = context.resolve(args[0]);

  if (arg0 === undefined || typeof arg0 === 'number') {
    return context.prng.bool(arg0);
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

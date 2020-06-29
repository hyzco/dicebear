import { PickByValue } from 'utility-types';
import type { IExprResolved, IExprContext } from '../expr';

export type IExprArgs<O, T> = [keyof PickByValue<O, T>];
export type IExpr<O, T> = ['$ref', IExprArgs<O, T>];

export function create<O, T>(...args: IExprArgs<O, T>): IExpr<O, T> {
  return ['$ref', args];
}

export function resolve<O, T>(context: IExprContext<O>, args: IExprArgs<O, T>): IExprResolved<IExpr<O, T>> {
  let arg0 = args[0];

  if (typeof arg0 === 'string' && context.root[arg0]) {
    return (context.root[arg0] = context.resolve(context.root[arg0], arg0));
  }

  throw new Error('Invalid arguments for $ref.');
}

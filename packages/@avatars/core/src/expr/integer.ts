import { IIntegerExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): number {
  if (isResponsible(expr)) {
    let args = expr[EXPR.INTEGER];

    let arg0 = context.resolve(args[0]);
    let arg1 = context.resolve(args[1]);

    if (typeof arg0 === 'number' && typeof arg1 === 'number') {
      return context.prng.integer(arg0, arg1);
    }
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIntegerExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.EVERY]) && expr[EXPR.INTEGER].length === 2;
}

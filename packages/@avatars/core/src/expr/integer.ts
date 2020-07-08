import { IIntegerExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): number {
  if (isResponsible(expr)) {
    let args = expr[EXPR.INTEGER];

    let arg0 = context.resolveValue(args[0]);
    let arg1 = context.resolveValue(args[1]);

    if (typeof arg0 === 'number' && typeof arg1 === 'number') {
      return context.prng.integer(arg0, arg1);
    }
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIntegerExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.INTEGER]) && expr[EXPR.INTEGER].length === 2;
}

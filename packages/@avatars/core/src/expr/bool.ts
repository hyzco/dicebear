import { IBoolExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): any {
  if (isResponsible(expr)) {
    let args = expr[EXPR.BOOL];
    let arg0 = context.resolveValue(args[0]);

    return context.prng.bool(typeof arg0 === 'number' ? arg0 : undefined);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IBoolExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.BOOL]);
}

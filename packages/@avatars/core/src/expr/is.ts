import { IIsExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.IS];

    return context.resolveValue(args[0]) === context.resolveValue(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIsExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.IS]) && expr[EXPR.IS].length === 2;
}

import { ILteExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.LTE];

    return context.resolveValue(args[0]) <= context.resolveValue(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is ILteExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.LTE]) && expr[EXPR.LTE].length === 2;
}

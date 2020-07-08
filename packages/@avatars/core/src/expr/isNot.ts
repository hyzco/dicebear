import { IIsNotExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.IS_NOT];

    return context.resolveValue(args[0]) !== context.resolveValue(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIsNotExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.IS_NOT]) && expr[EXPR.IS_NOT].length === 2;
}

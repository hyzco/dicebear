import { IRefExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IRefExpr): unknown {
  if (isResponsible(expr)) {
    let args = expr[EXPR.REF];

    return context.resolveRoot(context.resolveValue(args[0]));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IRefExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.REF]) && expr[EXPR.REF].length === 1;
}

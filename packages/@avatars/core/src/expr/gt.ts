import { IGtExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.GT];

    return context.resolveValue(args[0]) > context.resolveValue(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IGtExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.GT]) && expr[EXPR.GT].length === 2;
}

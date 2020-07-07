import { IGtExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.GT];

    return context.resolve(args[0]) > context.resolve(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IGtExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.GT]) && expr[EXPR.GT].length === 2;
}

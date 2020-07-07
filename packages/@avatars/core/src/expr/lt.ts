import { ILtExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.LT];

    return context.resolve(args[0]) < context.resolve(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is ILtExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.LT]) && expr[EXPR.LT].length === 2;
}

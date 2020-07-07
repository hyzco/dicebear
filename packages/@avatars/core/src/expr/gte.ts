import { IGteExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.GTE];

    return context.resolve(args[0]) >= context.resolve(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IGteExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.GTE]) && expr[EXPR.GTE].length === 2;
}

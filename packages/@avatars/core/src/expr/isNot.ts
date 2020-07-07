import { IIsNotExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.IS_NOT];

    return context.resolve(args[0]) !== context.resolve(args[1]);
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIsNotExpr {
  return typeof expr === 'object' && Array.isArray(expr[EXPR.IS_NOT]) && expr[EXPR.IS_NOT].length === 2;
}

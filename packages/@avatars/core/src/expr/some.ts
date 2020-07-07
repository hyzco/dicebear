import { ISomeExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: ISomeExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.SOME];

    return args[0].some((v) => context.resolve(v));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is ISomeExpr {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.EVERY]) &&
    Array.isArray(expr[EXPR.EVERY][0]) &&
    expr[EXPR.EVERY][0].length > 0
  );
}

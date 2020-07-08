import { ISomeExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: ISomeExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.SOME];

    return args[0].some((v) => context.resolveValue(v));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is ISomeExpr {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.SOME]) &&
    Array.isArray(expr[EXPR.SOME][0]) &&
    expr[EXPR.SOME][0].length > 0
  );
}

import { IEveryExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.EVERY];

    return args[0].every((v) => context.resolveValue(v));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: IExpr): expr is IEveryExpr {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.EVERY]) &&
    Array.isArray(expr[EXPR.EVERY][0]) &&
    expr[EXPR.EVERY][0].length > 0
  );
}

import { IHasNotExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.HAS_NOT];

    return false === args[1].map((v) => context.resolveValue(v)).includes(context.resolveValue(args[0]));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IHasNotExpr {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.HAS_NOT]) &&
    expr[EXPR.HAS_NOT].length === 2 &&
    Array.isArray(expr[EXPR.HAS_NOT][1])
  );
}

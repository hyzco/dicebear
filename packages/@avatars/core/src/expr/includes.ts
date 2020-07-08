import { IIncludesExpr, IExprContext, IExpr, EXPR } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.INCLUDES];

    return args[1].map((v) => context.resolveValue(v)).includes(context.resolveValue(args[0]));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IIncludesExpr {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.INCLUDES]) &&
    expr[EXPR.INCLUDES].length === 2 &&
    Array.isArray(expr[EXPR.INCLUDES][1])
  );
}

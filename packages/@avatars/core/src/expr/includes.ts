import { IIncludesExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): boolean {
  if (isResponsible(expr)) {
    let args = expr[EXPR.INCLUDES];

    return args[1].map((v) => context.resolve(v)).includes(context.resolve(args[0]));
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

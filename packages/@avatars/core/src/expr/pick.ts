import { IPickExpr, IExprContext, IExpr, EXPR } from './types';

export function resolve(context: IExprContext, expr: IExpr): unknown {
  if (isResponsible(expr)) {
    let args = expr[EXPR.PICK];

    return context.prng.pick(args[0].map((v) => context.resolve(v)));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IPickExpr<unknown> {
  return (
    typeof expr === 'object' &&
    Array.isArray(expr[EXPR.PICK]) &&
    Array.isArray(expr[EXPR.PICK][0]) &&
    expr[EXPR.PICK][0].length > 0
  );
}

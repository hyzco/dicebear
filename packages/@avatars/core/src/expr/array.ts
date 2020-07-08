import { IArrayExpr, IExprContext, IExpr } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): unknown {
  if (isResponsible(expr)) {
    return context.prng.pick(expr.map((v) => context.resolveValue(v)));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IArrayExpr<unknown> {
  return Array.isArray(expr) && expr.length > 0;
}

import { IArrayExpr, IExprContext, IExpr } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): unknown {
  if (isResponsible(expr)) {
    return expr;
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IArrayExpr<any> {
  return ['undefined', 'number', 'boolean', 'string'].includes(typeof expr);
}

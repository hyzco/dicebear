import { IArrayExpr, IExprContext, IExpr } from './types';

export function resolve(context: IExprContext, expr: IExpr): unknown {
  if (isResponsible(expr)) {
    return expr;
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IArrayExpr<any> {
  return ['undefined', 'integer', 'boolean', 'string'].includes(typeof expr);
}

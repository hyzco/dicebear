import { IObjectExpr, IExprContext, IExpr } from './types';

export function resolve(context: IExprContext, expr: IExpr): string {
  if (isResponsible(expr)) {
    return context.prng.pick(Object.keys(expr).filter((key) => context.resolve(expr[key])));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IObjectExpr {
  return typeof expr === 'object' && Object.keys(expr).length > 0;
}

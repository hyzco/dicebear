import { IObjectExpr, IExprContext, IExpr } from './interfaces';

export function resolveValue(context: IExprContext, expr: IExpr): string {
  if (isResponsible(expr)) {
    return context.prng.pick(Object.keys(expr).filter((key) => context.resolveValue(expr[key])));
  }

  throw new Error('Error during expression processing.');
}

export function isResponsible(expr: any): expr is IObjectExpr {
  return (
    typeof expr === 'object' && Object.keys(expr).length > 0 && Object.keys(expr).every((v) => null === v.match(/^\$/))
  );
}

import { IEveryExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): boolean;
export declare function isResponsible(expr: IExpr): expr is IEveryExpr;

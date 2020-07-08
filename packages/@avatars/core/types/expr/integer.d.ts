import { IIntegerExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): number;
export declare function isResponsible(expr: any): expr is IIntegerExpr;

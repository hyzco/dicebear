import { IObjectExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): string;
export declare function isResponsible(expr: any): expr is IObjectExpr;

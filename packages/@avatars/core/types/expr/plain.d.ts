import { IArrayExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): unknown;
export declare function isResponsible(expr: any): expr is IArrayExpr<any>;

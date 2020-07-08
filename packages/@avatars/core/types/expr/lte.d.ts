import { ILteExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): boolean;
export declare function isResponsible(expr: any): expr is ILteExpr;

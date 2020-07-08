import { ISomeExpr, IExprContext } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: ISomeExpr): boolean;
export declare function isResponsible(expr: any): expr is ISomeExpr;

import { IBoolExpr, IExprContext, IExpr } from './interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): any;
export declare function isResponsible(expr: any): expr is IBoolExpr;

import type { IPrng } from './prng';
import type { IExpr, IExprContext, IExprCollection } from './expr/interfaces';
export declare function resolveValue(context: IExprContext, expr: IExpr): any;
export declare function resolveRoot<O extends Record<string, any>>(context: IExprContext, name: keyof O): any;
export declare function resolve<O>(collection: IExprCollection<O>, prng: IPrng): O;

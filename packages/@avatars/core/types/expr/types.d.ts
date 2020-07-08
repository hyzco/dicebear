import type { IPrng } from '../prng';
export declare enum EXPR {
    EVERY = "$every",
    GT = "$gt",
    GTE = "$gte",
    INCLUDES = "$includes",
    IS = "$is",
    IS_NOT = "$isNot",
    LT = "$lt",
    LTE = "$lte",
    BOOL = "$bool",
    INTEGER = "$integer",
    PICK = "$pick",
    REF = "$ref",
    SOME = "$some"
}
export declare type IPlainExpr<T> = T;
export declare type IArrayExpr<T> = IExpr<T>[];
export declare type IObjectExpr = {
    [k: string]: IExpr;
};
export declare type IEveryExpr = Record<EXPR.EVERY, [IExpr[]]>;
export declare type IGtExpr = Record<EXPR.GT, [IExpr, IExpr]>;
export declare type IGteExpr = Record<EXPR.GTE, [IExpr, IExpr]>;
export declare type IIncludesExpr = Record<EXPR.INCLUDES, [IExpr, IExpr[]]>;
export declare type IIsExpr = Record<EXPR.IS, [IExpr, IExpr]>;
export declare type IIsNotExpr = Record<EXPR.IS_NOT, [IExpr, IExpr]>;
export declare type ILtExpr = Record<EXPR.LT, [IExpr, IExpr]>;
export declare type ILteExpr = Record<EXPR.LTE, [IExpr, IExpr]>;
export declare type IBoolExpr = Record<EXPR.BOOL, [IExpr<number | undefined>]>;
export declare type IIntegerExpr = Record<EXPR.INTEGER, [IExpr<number>, IExpr<number>]>;
export declare type IPickExpr<T> = Record<EXPR.PICK, [IExpr<T>[]]>;
export declare type IRefExpr = Record<EXPR.REF, [IExpr<string>]>;
export declare type ISomeExpr = Record<EXPR.SOME, [IExpr[]]>;
export declare type IExpr<T = any> = (T extends boolean ? IEveryExpr : never) | (T extends boolean ? IGtExpr : never) | (T extends boolean ? IGteExpr : never) | (T extends boolean ? IIncludesExpr : never) | (T extends boolean ? IIsExpr : never) | (T extends boolean ? IIsNotExpr : never) | (T extends boolean ? ILtExpr : never) | (T extends boolean ? ILteExpr : never) | (T extends boolean ? IBoolExpr : never) | (T extends boolean ? ISomeExpr : never) | (T extends number ? IIntegerExpr : never) | (T extends string ? IObjectExpr : never) | IPickExpr<T> | IRefExpr | IArrayExpr<T> | IPlainExpr<T>;
export interface IExprContext {
    prng: IPrng;
    callstack: string[];
    collection: IExprCollection<any>;
    collectionResolved: any;
    resolve: <T = any>(expr: IExpr) => T;
    resolveRoot: <T = any>(name: string) => T;
}
export declare type IExprCollection<C> = {
    [K in keyof C]: IExpr<C[K]>;
};

import type { IPrng } from '../prng';

export enum EXPR {
  EVERY = '$every',
  GT = '$gt',
  GTE = '$gte',
  INCLUDES = '$includes',
  IS = '$is',
  IS_NOT = '$isNot',
  LT = '$lt',
  LTE = '$lte',
  BOOL = '$bool',
  INTEGER = '$integer',
  PICK = '$pick',
  REF = '$ref',
  SOME = '$some',
}

export type IPlainExpr<T> = T;
export type IArrayExpr<T> = IExpr<T>[];
export type IObjectExpr = { [k: string]: IExpr };
export type IEveryExpr = Record<EXPR.EVERY, [IExpr[]]>;
export type IGtExpr = Record<EXPR.GT, [IExpr, IExpr]>;
export type IGteExpr = Record<EXPR.GTE, [IExpr, IExpr]>;
export type IIncludesExpr = Record<EXPR.INCLUDES, [IExpr, IExpr[]]>;
export type IIsExpr = Record<EXPR.IS, [IExpr, IExpr]>;
export type IIsNotExpr = Record<EXPR.IS_NOT, [IExpr, IExpr]>;
export type ILtExpr = Record<EXPR.LT, [IExpr, IExpr]>;
export type ILteExpr = Record<EXPR.LTE, [IExpr, IExpr]>;
export type IBoolExpr = Record<EXPR.BOOL, [IExpr<number | undefined>]>;
export type IIntegerExpr = Record<EXPR.INTEGER, [IExpr<number>, IExpr<number>]>;
export type IPickExpr<T> = Record<EXPR.PICK, [IExpr<T>[]]>;
export type IRefExpr = Record<EXPR.REF, [IExpr<string>]>;
export type ISomeExpr = Record<EXPR.SOME, [IExpr[]]>;

// prettier-ignore
export type IExpr<T = any> =
  | (T extends boolean ? IEveryExpr : never)
  | (T extends boolean ? IGtExpr : never)
  | (T extends boolean ? IGteExpr : never)
  | (T extends boolean ? IIncludesExpr : never)
  | (T extends boolean ? IIsExpr : never)
  | (T extends boolean ? IIsNotExpr : never)
  | (T extends boolean ? ILtExpr : never)
  | (T extends boolean ? ILteExpr : never)
  | (T extends boolean ? IBoolExpr : never)
  | (T extends boolean ? ISomeExpr : never)
  | (T extends number ? IIntegerExpr : never)
  | (T extends string ? IObjectExpr : never)
  | IPickExpr<T>
  | IRefExpr
  | IArrayExpr<T>
  | IPlainExpr<T>;

export interface IExprContext {
  prng: IPrng;
  callstack: string[];
  collection: IExprCollection<any>;
  collectionResolved: any;
  resolve: <T = any>(expr: IExpr) => T;
  resolveRoot: <T = any>(name: string) => T;
}

export type IExprCollection<C> = {
  [K in keyof C]: IExpr<C[K]>;
};

import type { IOptions } from './options';
import type { IPrng } from './prng';
import * as every from './expr/every';
import * as gt from './expr/gt';
import * as gte from './expr/gte';
import * as includes from './expr/includes';
import * as is from './expr/is';
import * as isNot from './expr/isNot';
import * as lt from './expr/lt';
import * as lte from './expr/lte';
import * as prngBool from './expr/prngBool';
import * as prngInteger from './expr/prngInteger';
import * as prngPick from './expr/prngPick';
import * as ref from './expr/ref';
import * as some from './expr/some';

export type IExpression<O, T> =
  | every.IEveryExpression<O>
  | gt.IGtExpression<O>
  | gte.IGteExpression<O>
  | includes.IIncludesExpression<O, T>
  | is.IIsExpression<O, T>
  | isNot.IIsNotExpression<O, T>
  | lt.ILtExpression<O>
  | lte.ILteExpression<O>
  | prngBool.IPrngBoolExpression<O>
  | prngInteger.IPrngIntegerExpression<O>
  | prngPick.IPrngPickExpression<O, T>
  | ref.IRefExpression<O>
  | some.ISomeExpression<O>
  | IExpressionResolved<T>;

// prettier-ignore
export type IExpressionResolved<T> =
  T extends every.IEveryExpression<any> ? boolean :
  T extends gt.IGtExpression<any> ? boolean :
  T extends gte.IGteExpression<any> ? boolean :
  T extends includes.IIncludesExpression<any, any> ? boolean :
  T extends is.IIsExpression<any, any> ? boolean :
  T extends isNot.IIsNotExpression<any, any> ? boolean :
  T extends lt.ILtExpression<any> ? boolean :
  T extends lte.ILteExpression<any> ? boolean :
  T extends prngBool.IPrngBoolExpression<any> ? boolean :
  T extends prngInteger.IPrngIntegerExpression<any> ? number :
  T extends prngPick.IPrngPickExpression<any, infer U> ? U :
  T extends ref.IRefExpression<infer O> ? O[T[1][0]] :
  T extends some.ISomeExpression<any> ? boolean :
  T extends Record<infer U, boolean> ? U :
  T extends (infer U)[] ? U : T;

export interface IResolveContext<O> {
  root: IOptions<O>;
  prng: IPrng;
  resolve: <O, T>(expr: IExpression<O, T>, addToCallstack?: string) => IExpressionResolved<T>;
}

export function createResolveContext<O>(callstack: string[], root: IOptions<O>, prng: IPrng): IResolveContext<O> {
  return {
    root,
    prng,
    resolve: <O, T>(expr: IExpression<O, T>, addToCallstack?: string) => {
      if (addToCallstack) {
        if (callstack.includes(addToCallstack)) {
          throw new Error(`Recursion Error: ${callstack.join(' → ')} → ${addToCallstack}`);
        } else {
          callstack.push(addToCallstack);
        }
      }

      return resolve(expr, callstack, root, prng);
    },
  };
}

export function resolve<T, O>(
  expr: IExpression<O, T>,
  callstack: string[],
  root: IOptions<O>,
  prng: IPrng
): IExpressionResolved<IExpression<O, T>> {
  if (Array.isArray(expr)) {
    if (typeof expr[0] === 'string' && Array.isArray(expr[1])) {
      let resolveContext = createResolveContext(callstack, root, prng);

      switch (expr[0]) {
        case '$includes':
          return includes.resolveIncludes(resolveContext, expr[1]);

        case '$every':
          return every.resolveEvery(resolveContext, expr[1]);

        case '$some':
          return some.resolveSome(resolveContext, expr[1]);

        case '$is':
          return is.resolveIs(resolveContext, expr[1]);

        case '$isNot':
          return isNot.resolveIsNot(resolveContext, expr[1]);

        case '$gt':
          return gt.resolveGt(resolveContext, expr[1]);

        case '$gte':
          return gte.resolveGte(resolveContext, expr[1]);

        case '$lt':
          return lt.resolveLt(resolveContext, expr[1]);

        case '$lte':
          return lte.resolveLte(resolveContext, expr[1]);

        case '$ref':
          return ref.resolveRef(resolveContext, expr[1]);

        case '$prng.integer':
          return prngInteger.resolvePrngInteger(resolveContext, expr[1]);

        case '$prng.bool':
          return prngBool.resolvePrngBool(resolveContext, expr[1]);

        case '$prng.pick':
          return prngPick.resolvePrngPick(resolveContext, expr[1]);
      }
    }

    let resolvedValues: Array<IExpressionResolved<any>> = [];

    expr.forEach((v: IExpression<O, any>) => {
      resolvedValues.push(resolve(v, callstack, root, prng));
    });

    return prng.pick(resolvedValues);
  } else if (typeof expr === 'object') {
    let resolvedValues: Array<IExpressionResolved<any>> = [];

    Object.entries(expr).forEach(([k, v]) => {
      if (resolve(v, callstack, root, prng)) {
        resolvedValues.push(k);
      }
    });

    return prng.pick(resolvedValues);
  }

  return expr;
}

export { every, gt, gte, includes, is, isNot, lt, lte, prngBool, prngInteger, prngPick, ref, some };

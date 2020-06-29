import { Primitive } from 'utility-types';
import type { IOptions } from './options';
import type { IPrng } from './prng';
import * as array from './expr/array';
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

export type IExpr<O, T> =
  | (T extends boolean ? every.IExpr<O> : never)
  | (T extends boolean ? gt.IExpr<O> : never)
  | (T extends boolean ? gte.IExpr<O> : never)
  | (T extends boolean ? includes.IExpr<O, T> : never)
  | (T extends boolean ? is.IExpr<O, T> : never)
  | (T extends boolean ? isNot.IExpr<O, T> : never)
  | (T extends boolean ? lt.IExpr<O> : never)
  | (T extends boolean ? lte.IExpr<O> : never)
  | (T extends boolean ? prngBool.IExpr<O> : never)
  | (T extends boolean ? some.IExpr<O> : never)
  | (T extends number ? prngInteger.IExpr<O> : never)
  | (T extends Primitive ? prngPick.IExpr<O, T> : never)
  | (T extends Primitive ? ref.IExpr<O, T> : never)
  | (T extends Primitive ? array.IExpr<O, T> : never)
  | (T extends Primitive ? T : never);

// prettier-ignore
export type IExprResolved<E> =
  E extends every.IExpr<infer O> ? boolean :
  E extends gt.IExpr<infer O> ? boolean :
  E extends gte.IExpr<infer O> ? boolean :
  E extends includes.IExpr<infer O, infer T> ? boolean :
  E extends is.IExpr<infer O, infer T> ? boolean :
  E extends isNot.IExpr<infer O, infer T> ? boolean :
  E extends lt.IExpr<infer O> ? boolean :
  E extends lte.IExpr<infer O> ? boolean :
  E extends prngBool.IExpr<infer O> ? boolean :
  E extends prngInteger.IExpr<infer O> ? number :
  E extends some.IExpr<infer O> ? boolean :
  E extends ref.IExpr<infer O, infer T> ? T :
  E extends prngPick.IExpr<infer O, infer T> ? T :
  E extends array.IExpr<infer O, infer T> ? T :
  E extends Primitive ? E :
  never;

export interface IExprContext<O> {
  root: IOptions<O>;
  prng: IPrng;
  resolve: <O, T>(expr: IExpr<O, T>, addToCallstack?: string) => IExprResolved<T>;
}

export function createContext<O>(callstack: string[], root: IOptions<O>, prng: IPrng): IExprContext<O> {
  return {
    root,
    prng,
    resolve: <O, T>(expr: IExpr<O, T>, addToCallstack?: string) => {
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

export function resolve<O, T>(
  expr: IExpr<O, T>,
  callstack: string[],
  root: IOptions<O>,
  prng: IPrng
): IExprResolved<IExpr<O, T>> {
  if (Array.isArray(expr)) {
    let resolveContext = createContext(callstack, root, prng);

    if (typeof expr[0] === 'string' && Array.isArray(expr[1])) {
      switch (expr[0]) {
        case '$includes':
          return includes.resolve(resolveContext, expr[1]);

        case '$every':
          return every.resolve(resolveContext, expr[1]);

        case '$some':
          return some.resolve(resolveContext, expr[1]);

        case '$is':
          return is.resolve(resolveContext, expr[1]);

        case '$isNot':
          return isNot.resolve(resolveContext, expr[1]);

        case '$gt':
          return gt.resolve(resolveContext, expr[1]);

        case '$gte':
          return gte.resolve(resolveContext, expr[1]);

        case '$lt':
          return lt.resolve(resolveContext, expr[1]);

        case '$lte':
          return lte.resolveLte(resolveContext, expr[1]);

        case '$ref':
          return ref.resolve(resolveContext, expr[1]);

        case '$prng.integer':
          return prngInteger.resolve(resolveContext, expr[1]);

        case '$prng.bool':
          return prngBool.resolve(resolveContext, expr[1]);

        case '$prng.pick':
          return prngPick.resolve(resolveContext, expr[1]);
      }
    }

    return array.resolve(resolveContext, expr);
  } else if (typeof expr === 'object') {
    let resolvedValues: Array<IExprResolved<any>> = [];

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

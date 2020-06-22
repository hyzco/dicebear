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

export type IExpression<T> =
  | every.IEveryExpression
  | gt.IGtExpression
  | gte.IGteExpression
  | includes.IIncludesExpression<T>
  | is.IIsExpression<T>
  | isNot.IIsNotExpression<T>
  | lt.ILtExpression
  | lte.ILteExpression
  | prngBool.IPrngBoolExpression
  | prngInteger.IPrngIntegerExpression
  | prngPick.IPrngPickExpression<T>
  | ref.IRefExpression
  | some.ISomeExpression
  | IExpressionResolved<T>;

// prettier-ignore
export type IExpressionResolved<T> =
  T extends every.IEveryExpression ? boolean :
  T extends gt.IGtExpression ? boolean :
  T extends gte.IGteExpression ? boolean :
  T extends includes.IIncludesExpression<any> ? boolean :
  T extends is.IIsExpression<any> ? boolean :
  T extends isNot.IIsNotExpression<any> ? boolean :
  T extends lt.ILtExpression ? boolean :
  T extends lte.ILteExpression ? boolean :
  T extends prngBool.IPrngBoolExpression ? boolean :
  T extends prngInteger.IPrngIntegerExpression ? number :
  T extends prngPick.IPrngPickExpression<infer U> ? U :
  T extends ref.IRefExpression ? any :
  T extends some.ISomeExpression ? boolean :
  T extends Record<infer U, boolean> ? U :
  T extends (infer U)[] ? U : T;

export interface IResolveContext<O> {
  root: IOptions<O>;
  prng: IPrng;
  resolve: <T>(expr: IExpression<T>, addToCallstack?: string) => IExpressionResolved<T>;
}

export function createResolveContext<O>(callstack: string[], root: IOptions<O>, prng: IPrng): IResolveContext<O> {
  return {
    root,
    prng,
    resolve: <T>(expr: IExpression<T>, addToCallstack?: string) => {
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

export async function resolve<T, O>(
  expr: IExpression<T>,
  callstack: string[],
  root: IOptions<O>,
  prng: IPrng
): IExpressionResolved<T> {
  if (Array.isArray(expr)) {
    if (typeof expr[0] === 'string') {
      if (Array.isArray(expr[1])) {
        let resolveContext = createResolveContext(callstack, root, prng);

        switch (expr[0]) {
          case '$includes':
            return includes.resolveIncludes(expr[1], resolveContext);

          case '$every':
            return every.resolveEvery(expr[1], resolveContext);

          case '$some':
            return some.resolveSome(expr[1], resolveContext);

          case '$is':
            return is.resolveIs(expr[1], resolveContext);

          case '$isNot':
            return isNot.resolveIsNot(expr[1], resolveContext);

          case '$gt':
            return gt.resolveGt(expr[1], resolveContext);

          case '$gte':
            return gte.resolveGte(expr[1], resolveContext);

          case '$lt':
            return lt.resolveLt(expr[1], resolveContext);

          case '$lte':
            return lte.resolveLte(expr[1], resolveContext);

          case '$ref':
            return ref.resolveRef(expr[1], resolveContext);

          case '$prng.integer':
            return prngInteger.resolvePrngInteger(expr[1], resolveContext);

          case '$prng.bool':
            return prngBool.resolvePrngBool(expr[1], resolveContext);

          case '$prng.pick':
            return prngPick.resolvePrngPick(expr[1], resolveContext);

          default:
            throw new Error(`Unsupported expression ${expr[0]}`);
        }
      } else {
        throw new Error(`Arguments must be defined as an array. ${typeof args} given.`);
      }
    } else if (nesting === 0) {
      let arr = expr.map((v) => resolve(v, root, prng, callstack, nesting + 1));

      return prng.pick(arr);
    }
  }

  if (typeof expr === 'object' && nesting === 0) {
    let arr = Object.keys(expr).filter((key) => resolve(expr[key], root, prng, callstack, nesting + 1));

    return prng.pick(arr);
  }

  return expr;
}

export { every, gt, gte, includes, is, isNot, lt, lte, prngBool, prngInteger, prngPick, ref, some };

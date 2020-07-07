import type { IPrng } from './prng';
import type { IExpr, IExprContext, IExprCollection } from './expr/types';
import * as array from './expr/array';
import * as bool from './expr/bool';
import * as every from './expr/every';
import * as gt from './expr/gt';
import * as gte from './expr/gte';
import * as includes from './expr/includes';
import * as integer from './expr/integer';
import * as is from './expr/is';
import * as isNot from './expr/isNot';
import * as lt from './expr/lt';
import * as lte from './expr/lte';
import * as object from './expr/object';
import * as pick from './expr/pick';
import * as plain from './expr/plain';
import * as ref from './expr/ref';
import * as some from './expr/some';

export function resolveValue(context: IExprContext, expr: IExpr) {
  let resolvers: Array<{
    resolve: (context: IExprContext, expr: IExpr) => any;
    isResponsible: (expr: any) => boolean;
  }> = [array, bool, every, gt, gte, includes, integer, is, isNot, lt, lte, object, pick, plain, ref, some];

  for (let i = 0; i < resolvers.length; i++) {
    let resolver = resolvers[i];

    if (resolver.isResponsible(expr)) {
      return resolver.resolve(context, expr);
    }
  }

  throw new Error('Unsupported expression.');
}

export function resolveRoot<O extends Record<string, any>>(context: IExprContext, name: keyof O): any {
  if (context.callstack.includes(name.toString())) {
    throw new Error(`Recursion Error: ${context.callstack.join(' → ')} → ${name}`);
  }

  if (context.collectionResolved[name] === undefined) {
    let oldCallstack = context.callstack;

    context.callstack = [...context.callstack, name.toString()];

    context.collectionResolved[name] = resolveValue(context, context.collection[name]);

    context.callstack = oldCallstack;
  }

  return context.collectionResolved[name];
}

export function resolve<O>(collection: IExprCollection<O>, prng: IPrng): O {
  let context: IExprContext = {
    prng,
    collection,
    collectionResolved: {},
    callstack: [],
    resolveRoot: (name: string) => resolveRoot(this, name),
    resolve: (expr: IExpr) => resolveValue(this, expr),
  };

  Object.keys(collection).forEach((name) => {
    context.resolveRoot(name);
  });

  return context.collectionResolved as O;
}

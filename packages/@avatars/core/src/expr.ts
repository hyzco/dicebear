import type { IPrng } from './prng';
import type { IExpr, IExprContext, IExprCollection } from './expr/interfaces';
import * as expressions from './expr/index';

export function resolveValue(context: IExprContext, expr: IExpr) {
  let expressionsArr = Object.values(expressions);

  for (let i = 0; i < expressionsArr.length; i++) {
    let resolver = expressionsArr[i];

    if (resolver.isResponsible(expr)) {
      return resolver.resolveValue(context, expr);
    }
  }

  console.log(expr);
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
    resolveRoot: (name: string) => resolveRoot(context, name),
    resolveValue: (expr: IExpr) => resolveValue(context, expr),
  };

  Object.keys(collection).forEach((name) => {
    context.resolveRoot(name);
  });

  return context.collectionResolved as O;
}

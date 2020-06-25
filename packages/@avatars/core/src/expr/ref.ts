import type { IExpressionResolved, IResolveContext, IExpression } from '../expr';

export type IRefExpressionArguments<O> = [IExpression<O, keyof O>];
export type IRefExpression<O> = ['$ref', IRefExpressionArguments<O>];

export function ref<O>(...args: IRefExpressionArguments<O>): IRefExpression<O> {
  return ['$ref', args];
}

export function resolveRef<O>(
  context: IResolveContext<O>,
  args: IRefExpressionArguments<O>
): IExpressionResolved<IRefExpression<O>> {
  let arg0 = context.resolve(args[0]);

  if (typeof arg0 === 'string' && context.root[arg0]) {
    return (context.root[arg0] = context.resolve(context.root[arg0], arg0));
  }

  throw new Error('Invalid arguments for $ref.');
}

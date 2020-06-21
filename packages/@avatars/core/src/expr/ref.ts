import type { IExpression, IExpressionResolved } from '../expr';
import type { IPrng } from '../prng';

export type IRefExpressionArguments = [string];
export type IRefExpression = ['$ref', IRefExpressionArguments];

export function ref(...args: IRefExpressionArguments): IRefExpression {
  return ['$ref', args];
}

export function resolveRef<T = any>(
  args: any[],
  root: Record<string, any>,
  prng: IPrng,
  callstack: string[],
  nesting: number
): IExpressionResolved<IRefExpression> {
  if (typeof args[0] === 'string') {
    if (callstack.includes(args[0])) {
      throw new Error(`Recursion Error: ${callstack.join(' → ')}`);
    }

    return (root[args[0]] = resolve(root[args[0]], root, prng, [...callstack, args[0]], nesting + 1));
  }

  throw new Error('Invalid arguments for $ref.');
}

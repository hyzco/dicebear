import * as expr from './expr';
import * as prng from './prng';
import type * as style from './style';

export type IOptions<T> = {
  [K in keyof T]: expr.IExpression<T[K]>;
};

export type IProcessedOptions<T extends IOptions<T>> = {
  [K in keyof T]: expr.IExpressionResolved<T[K]>;
};

export function process<O extends style.IStyleOptions>(options: O) {
  let processedOptions = { ...options };
  let prngInstance = prng.create(typeof processedOptions.seed === 'string' ? processedOptions.seed : '');

  let keys = Object.keys(processedOptions) as Array<keyof O>;

  keys.forEach((key) => {
    if (processedOptions.hasOwnProperty(key)) {
      processedOptions[key] = expr.resolve(processedOptions[key], processedOptions, prngInstance, [key as string]);
    }
  });

  return processedOptions;
}

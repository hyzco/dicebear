import * as expr from './expr';
import * as prng from './prng';
import { IExprResolvedCollection } from './expr/types';

export type IDefaultOptions = {
  seed?: string;
  radius?: number;
  r?: number;
  dataUri?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  background?: string;
  b?: string;
};

export type IOptions<O extends {}, D = O & IDefaultOptions> = IExprResolvedCollection<D>;

export type IProcessedOptions<T extends IOptions<{}>> = {
  [K in keyof T]: expr.IExprResolved<T[K]>;
};

export function process<O extends {}>(options: IOptions<O>): IProcessedOptions<IOptions<O>> {
  let processedOptions = { ...options };
  let prngInstance = prng.create(typeof processedOptions.seed === 'string' ? processedOptions.seed : '');

  let keys = Object.keys(processedOptions) as Array<keyof O>;

  keys.forEach((key) => {
    let val = processedOptions[key];

    processedOptions[key] = expr.resolve(val, [key as string], processedOptions, prngInstance);
  });

  return processedOptions as IProcessedOptions<IOptions<O>>;
}

import type * as svgson from 'svgson';
import type { IOptions } from './options';
import { IPrng } from './prng';

export interface IStyleCreateFunction<O> {
  (prng: IPrng, options: Partial<IOptions<O>>): string | svgson.INode;
}

export interface IStyle<O> {
  defaultOptions: IOptions<O>;
  create: IStyleCreateFunction<O>;
}

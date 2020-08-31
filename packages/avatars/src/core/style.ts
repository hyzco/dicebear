import type * as svgson from 'svgson';
import type { IOptions } from './options';
import { IPrng } from './prng';
import type { JSONSchema7 } from 'json-schema';

export type IStyleDefaultOptions<O> = IOptions<O>;
export type IstyleSchema = JSONSchema7;
export type IStyleCreate<O> = (prng: IPrng, options: Partial<IOptions<O>>) => string | svgson.INode;

export interface IStyle<O> {
  defaultOptions: IStyleDefaultOptions<O>;
  schema: IstyleSchema;
  create: IStyleCreate<O>;
}

import type * as svgson from 'svgson';
import { IOptions } from './options';

export interface IStyleGenerator<O> {
  (options: Partial<IOptions<O>>): string | svgson.INode;
}

export interface IStyle<O> {
  options: IOptions<O>;
  generator: IStyleGenerator<O>;
}

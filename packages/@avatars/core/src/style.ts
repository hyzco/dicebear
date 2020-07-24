import type * as svgson from 'svgson';
import type { IOptions } from './options';
import type { IExprCollection } from './expr/interfaces';

export interface IStyleCreateFunction<O> {
  (options: Partial<IOptions<O>>): string | svgson.INode;
}

export interface IStyle<O> {
  defaultOptions: IExprCollection<IOptions<O>>;
  create: IStyleCreateFunction<O>;
}

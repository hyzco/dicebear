import * as options from './options';
import type * as style from './style';
import { IExprCollection } from './expr/interfaces';
export declare function create<O>(styleObject: style.IStyle<O>, optionsOrSeed?: string | Partial<IExprCollection<options.IOptions<O>>>): string;

import type { IStyle } from './style';
import type { IOptions } from './options';
import { create } from './core';

/**
 * Compatibility layer for versions >= 3.0.0 and < 4.3.0
 */
export class CoreDefault<O> {
  protected style: IStyle<O>;
  protected defaultOptions?: Partial<IOptions<O>>;

  constructor(style: IStyle<O>, defaultOptions: Partial<IOptions<O>> = style.defaultOptions) {
    this.style = style;
    this.defaultOptions = defaultOptions;
  }

  public create(seed: string, options?: Partial<IOptions<O>>) {
    options = {
      backgroundColor: options.background || this.defaultOptions.background,
      ...this.defaultOptions,
      ...options,
      seed,
    };

    return create(this.style, options);
  }
}

export function createStyleDefault<O>(style: IStyle<O>) {
  return Object.assign((defaultOptions: Partial<IOptions<O>>): Omit<IStyle<O>, 'default'> => {
    return {
      ...style,
      defaultOptions: {
        ...style.defaultOptions,
        ...defaultOptions,
      },
    };
  }, style);
}

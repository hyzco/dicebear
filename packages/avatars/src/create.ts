import * as svg from './svg';
import { applyAliases } from './options';
import type { IStyle, IOptions } from './interfaces';
import * as prng from './prng';

export function createAvatar<O>(style: IStyle<O>, options: Partial<IOptions<O>> = {}) {
  options = applyAliases<O>({
    seed: Math.random().toString(),
    ...style.defaultOptions,
    ...options,
  });

  let prngInstance = prng.create(typeof options.seed === 'string' ? options.seed : '');

  let avatar = style.create(prngInstance, options);

  if (Object.keys(options).length > 0) {
    avatar = svg.parse(avatar);

    if (typeof options.width === 'number') {
      svg.addWidth(avatar, options.width as number);
    }

    if (typeof options.height === 'number') {
      svg.addHeight(avatar, options.height as number);
    }

    if (typeof options.margin === 'number') {
      svg.addMargin(avatar, options.margin as number);
    }

    if (typeof options.backgroundColor === 'string') {
      svg.addBackground(avatar, options.backgroundColor as string);
    }

    if (typeof options.radius === 'number') {
      svg.addRadius(avatar, options.radius as number);
    }
  }

  avatar = svg.stringify(avatar);

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}

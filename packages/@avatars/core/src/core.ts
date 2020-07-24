import * as dataUri from './dataUri';
import * as svg from './svg';
import { process as processOptions, IOptions } from './options';
import type { IStyle } from './style';
import { IExprCollection } from './expr/interfaces';

export function create<O>(style: IStyle<O>, options: Partial<IExprCollection<IOptions<O>>> = {}) {
  // Apply defaults and alias options and process config
  let processedOptions = processOptions<O>({
    seed: Math.random().toString(),
    ...style.defaultOptions,
    ...options,
  });

  let avatar = style.create(processedOptions);

  if (Object.keys(options).length > 0) {
    avatar = svg.parse(avatar);

    if (typeof processedOptions.width === 'number') {
      svg.addWidth(avatar, processedOptions.width as number);
    }

    if (typeof processedOptions.height === 'number') {
      svg.addHeight(avatar, processedOptions.height as number);
    }

    if (typeof processedOptions.margin === 'number') {
      svg.addMargin(avatar, processedOptions.margin as number);
    }

    if (typeof processedOptions.background === 'string') {
      svg.addBackground(avatar, processedOptions.background as string);
    }

    if (typeof processedOptions.radius === 'number') {
      svg.addRadius(avatar, processedOptions.radius as number);
    }
  }

  avatar = svg.stringify(avatar);

  return processedOptions.dataUri ? dataUri.encode(avatar) : avatar;
}

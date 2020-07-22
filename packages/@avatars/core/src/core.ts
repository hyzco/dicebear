import * as dataUri from './dataUri';
import * as svg from './svg';
import * as options from './options';
import type * as style from './style';
import { IExprCollection } from './expr/interfaces';

export function create<O>(
  styleObject: style.IStyle<O>,
  optionsOrSeed: string | Partial<IExprCollection<options.IOptions<O>>> = {}
) {
  let seed = Math.random().toString();
  let optionsObject: Partial<IExprCollection<options.IOptions<O>>> = {};

  if (typeof optionsOrSeed === 'string') {
    seed = optionsOrSeed;
  } else {
    optionsObject = optionsOrSeed;
  }

  // Apply defaults and alias options and process config
  let processedOptions = options.process<O>({
    seed: seed,
    ...styleObject.options,
    ...optionsObject,
  });

  let avatar = styleObject.generator(processedOptions);

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

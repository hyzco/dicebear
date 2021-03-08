import type { Style, StyleOptions } from './types';
import * as utils from './utils';

export function createAvatar<O extends {}>(style: Style<O>, options: StyleOptions<O>) {
  options = utils.style.options(style, options);

  let prngInstance = utils.prng.create(options.seed);
  let result = style.create({ prng: prngInstance, options });

  if (options.width) {
    result.attributes.width = options.width.toString();
  }

  if (options.height) {
    result.attributes.height = options.height.toString();
  }

  if (options.margin) {
    result.body = utils.svg.addMargin(result, options);
  }

  if (options.backgroundColor) {
    result.body = utils.svg.addBackgroundColor(result, options);
  }

  if (options.radius) {
    result.body = utils.svg.addRadius(result, options);
  }

  let avatar = `
    <svg ${utils.svg.createAttrString(result.attributes)}>
      ${utils.svg.getMetadata(style)}
      ${result.head ?? ''}
      ${result.body}
    </svg>
  `;

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}

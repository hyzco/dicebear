import type { Style } from './style';
import * as prng from './prng';
import { svg, schema, array } from './utils';
import type { Options } from './options';

export function createAvatar<O extends Options>(style: Style<O>, options: O) {
  let defaultOptions = schema.defaults(style.schema) as any;

  options = {
    seed: Math.random().toString(),
    ...defaultOptions,
    ...options,
  };
  /**
  if (options.backgroundColor) {
    options.backgroundColor = array.alias({
      values: options.backgroundColor,
      aliases: style.colors,
      fallback: (v) => v,
    });
  }
  */
  let prngInstance = prng.create(options.seed);
  let result = style.create({ prng: prngInstance, options });

  if (options.width) {
    result.attributes.width = options.width.toString();
  }

  if (options.height) {
    result.attributes.height = options.height.toString();
  }

  if (options.margin) {
    result.body = svg.addMargin(result, options);
  }

  if (options.backgroundColor) {
    result.body = svg.addBackgroundColor(result, options);
  }

  if (options.radius) {
    result.body = svg.addRadius(result, options);
  }

  let attributes: Record<string, string> = { ...svg.getXmlnsAttributes(), ...result.attributes };
  let attributesAsString = Object.keys(attributes)
    .map((attr) => `${attr}="${attributes[attr].replace('"', '&quot;')}"`)
    .join(' ');

  let avatar = `
    <svg ${attributesAsString}>
      ${svg.getMetadata(style)}
      ${result.head ?? ''}
      ${result.body}
    </svg>
  `;

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}

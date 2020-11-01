import type { Style } from './types';
import type { Options } from './options';
import { svg, schema, prng } from './utils';

export function createAvatar<O extends Options>(style: Style<O>, options: O) {
  let defaultOptions = schema.defaults(style.schema);

  options = {
    seed: Math.random().toString(),
    ...defaultOptions,
    ...options,
  };

  schema.aliases(style.schema).forEach((aliases) => {
    let val: any = aliases.reduce((current, alias) => {
      return current || options[alias];
    }, undefined);

    aliases.forEach((alias: keyof O) => {
      options[alias] = val;
    });
  });

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

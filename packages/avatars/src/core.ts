import type { IStyle, IOptions } from './interfaces';
import * as prng from './prng';
import { svg, schema, object } from './utils';

export function createAvatar<O>(style: IStyle<O>, options: Partial<IOptions<O>> = {}) {
  let defaultOptions = schema.defaults(style.schema) as any;

  options = object.applyAliases(
    {
      seed: Math.random().toString(),
      ...defaultOptions,
      ...options,
    },
    schema.aliases(style.schema)
  );

  let prngInstance = prng.create(options.seed);
  let result = style.create(prngInstance, options);

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
      ${result.head}
      ${result.body}
    </svg>
  `;

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}

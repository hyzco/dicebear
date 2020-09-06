import { applyAliases } from './options';
import type { IStyle, IOptions, IStyleCreateResult } from './interfaces';
import * as prng from './prng';
import { getXmlnsAttributes, getMetadata } from './utils';

export function createAvatar<O>(style: IStyle<O>, options: Partial<IOptions<O>> = {}) {
  options = applyAliases<O>({
    seed: Math.random().toString(),
    ...style.defaultOptions,
    ...options,
  });

  let prngInstance = prng.create(options.seed);
  let result = style.create(prngInstance, options);

  if (options.width) {
    result.attributes.width = options.width.toString();
  }

  if (options.height) {
    result.attributes.height = options.height.toString();
  }

  if (options.margin) {
    result.body = addMargin(result, options);
  }

  if (options.backgroundColor) {
    result.body = addBackgroundColor(result, options);
  }

  if (options.radius) {
    result.body = addRadius(result, options);
  }

  let attributes: Record<string, string> = { ...getXmlnsAttributes(), ...result.attributes };
  let attributesAsString = Object.keys(attributes)
    .map((attr) => `${attr}="${attributes[attr].replace('"', '&quot;')}"`)
    .join(' ');

  let avatar = `
    <svg ${attributesAsString}>
      ${getMetadata(style)}
      ${result.head}
      ${result.body}
    </svg>
  `;

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}

function getViewBox(result: IStyleCreateResult) {
  let viewBox = result.attributes['viewBox'].split(' ');
  let x = parseInt(viewBox[0]);
  let y = parseInt(viewBox[1]);
  let width = parseInt(viewBox[2]);
  let height = parseInt(viewBox[3]);

  return {
    x,
    y,
    width,
    height,
  };
}

function addMargin<O>(result: IStyleCreateResult, options: IOptions<O>) {
  let viewBox = getViewBox(result);
  let translateX = (viewBox.width * options.margin) / 100;
  let translateY = (viewBox.height * options.margin) / 100;
  let scale = 1 - (options.margin * 2) / 100;
  let rectWidth = viewBox.width.toString();
  let rectHeight = viewBox.height.toString();
  let rectX = viewBox.x.toString();
  let rectY = viewBox.y.toString();

  return `
    <g transform="${`translate(${translateX}, ${translateY})`}">
      <g transform="${`scale(${scale})`}">
        <rect fill="none" width="${rectWidth}" height="${rectHeight}" x="${rectX}" y="${rectY}" />
        ${result.body}
      </g>
    </g>
  `;
}

function addBackgroundColor<O>(result: IStyleCreateResult, options: IOptions<O>) {
  let viewBox = getViewBox(result);
  let width = viewBox.width.toString();
  let height = viewBox.height.toString();
  let x = viewBox.x.toString();
  let y = viewBox.y.toString();

  return `
    <rect fill="${options.backgroundColor}" width="${width}" height="${height}" x="${x}" y="${y}" />
    ${result.body}
  `;
}

function addRadius<O>(result: IStyleCreateResult, options: IOptions<O>) {
  let viewBox = getViewBox(result);
  let width = viewBox.width.toString();
  let height = viewBox.height.toString();
  let rx = ((viewBox.width * options.radius) / 100).toString();
  let ry = ((viewBox.height * options.radius) / 100).toString();
  let x = viewBox.x.toString();
  let y = viewBox.y.toString();

  return `
    <mask id="avatarsRadiusMask">
      <rect width="${width}" height="${height}" rx="${rx}" ry="${ry}" x="${x}" y="${y}" fill="#fff" />
    </mask>
    <g mask="url(#avatarsRadiusMask)>${result.body}</g>
  `;
}

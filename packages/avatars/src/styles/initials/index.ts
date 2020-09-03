import { IStyle } from '@dicebear/avatars';

// @ts-ignore
import initials from 'initials';

type Options = {
  margin?: number;
  fontSize?: number;
  chars?: number;
  bold?: boolean;
};

const style: IStyle<Options> = function (random, options = {}) {
  options.fontSize = options.fontSize || 50;
  options.chars = options.chars || 2;

  let seedInitials = (initials(random.seed.trim()) as string).toLocaleUpperCase().slice(0, options.chars);
  let fontFamily = 'Arial,sans-serif';

  // prettier-ignore
  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 1 1" version="1.1">`,
    options.margin ? `<g transform="translate(${options.margin / 100}, ${options.margin / 100})">` : '',
    options.margin ? `<g transform="scale(${1 - (options.margin * 2) / 100})">` : '',
    `<text x="50%" y="50%" style="${options.bold ? 'font-weight: bold;' : ''} font-family: ${fontFamily}; font-size: ${options.fontSize / 100}px" fill="#FFF" text-anchor="middle" dy=".178">${seedInitials}</text>`,
    options.margin ? '</g>' : '',
    options.margin ? '</g>' : '',
    '</svg>'
  ].join('');

  options.margin = undefined;

  return svg;
};

export default style;

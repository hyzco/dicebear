import type { IOptions, IStyle, IStyleCreateResult } from '../interfaces';

type CreateGroupProps = {
  children: string;
  x: number;
  y: number;
};

export function createGroup({ children, x, y }: CreateGroupProps) {
  return `<g transform="translate(${x}, ${y})">${children}</g>`;
}

export function getXmlnsAttributes() {
  return {
    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    'xmlns:cc': 'http://creativecommons.org/ns#',
    'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'xmlns:svg': 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/svg',
  };
}

export function getMetadata<O>(style: IStyle<O>) {
  let isCcBy40 = 'CC BY 4.0' === style.license.name;
  let isCcZero10 = 'CC0 1.0' === style.license.name;
  let isCc = isCcBy40 || isCcZero10;

  return `
    <metadata id="metadata70">
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          <dc:title>${style.title}</dc:title>
          <cc:license rdf:resource="${style.license.link}" />
          <dc:creator>
            <cc:Agent>
              <dc:title>${style.creator}</dc:title>
            </cc:Agent>
          </dc:creator>
          <dc:source>${style.source}</dc:source>
        </cc:Work>
        ${
          isCc
            ? `
              <cc:License rdf:about="${style.license.link}">
                <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                ${isCcBy40 ? '<cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />' : ''}
                ${isCcBy40 ? '<cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />' : ''}
                <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
              </cc:License>
            `
            : ''
        }
      </rdf:RDF>
    </metadata>
  `;
}

export function getViewBox(result: IStyleCreateResult) {
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

export function addMargin<O>(result: IStyleCreateResult, options: IOptions<O>) {
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

export function addBackgroundColor<O>(result: IStyleCreateResult, options: IOptions<O>) {
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

export function addRadius<O>(result: IStyleCreateResult, options: IOptions<O>) {
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

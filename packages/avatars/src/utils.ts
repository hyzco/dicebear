import type { IOptions, IStyle } from './interfaces';

let maskId = 0;

export function filterByOption<T>(options: IOptions<any>, name: string, values: Record<string, T>) {
  let mode = options.mode === 'exclude';
  let filtered = Object.keys(values)
    .filter((key) => {
      let val = Array.isArray(options[name]) ? options[name] : [key];

      return mode === val.includes(key);
    })
    .map((key) => values[key]);

  return filtered || Object.values(values);
}

export function createGroup(content: string, x: number, y: number) {
  return `<g transform="translate(${x}, ${y})">${content}</g>`;
}

export function nextMaskId() {
  return `mask${++maskId}`;
}

export function currentMaskId() {
  return `mask${maskId}`;
}

export function resetMaskId() {
  maskId = 0;
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

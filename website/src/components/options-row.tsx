import * as React from 'react';
import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import ReactMarkdown from 'react-markdown';

type Props = {
  name: string;
  aliases?: string[];
  definition: JSONSchema7Definition;
};

function OptionsRow({ name, aliases = [], definition }: Props) {
  let types: JSONSchema7TypeName[] = [];

  if (typeof definition === 'boolean') {
    return null;
  }

  if (definition.oneOf) {
    definition.oneOf.forEach((v) => {
      if (typeof v !== 'boolean' && typeof v.type === 'string') {
        types.push(v.type);
      }
    });
  } else if (typeof definition.type === 'string') {
    types.push(definition.type);
  }

  let typesList = types
    .filter((v, k) => types.indexOf(v) === k)
    .reduce((result, v, k) => {
      let isFirst = k === 0;
      let isLast = k === types.length - 1;

      if (false === isFirst) {
        if (isLast) {
          result += ' or ';
        } else {
          result += ', ';
        }
      }

      result += '`' + v + '`';

      return result;
    }, '');

  return (
    <tr>
      <td>{name}</td>
      <td>{aliases.join(',')}</td>
      <td>
        <ReactMarkdown children={typesList} disallowedTypes={['paragraph']} unwrapDisallowed skipHtml />
      </td>
      <td>{definition.default !== undefined && <code>{JSON.stringify(definition.default)}</code>}</td>
      <td>
        <ReactMarkdown
          children={definition.description ?? ''}
          disallowedTypes={['paragraph']}
          unwrapDisallowed
          skipHtml
        />
      </td>
    </tr>
  );
}

export default OptionsRow;

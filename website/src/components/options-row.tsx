import * as React from 'react';
import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import ReactMarkdown from 'react-markdown';
import Heading from '@theme/Heading';

type Props = {
  name: string;
  aliases?: string[];
  definition: JSONSchema7Definition;
};

const H3 = Heading('h3');

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
    <>
      <H3 id={name}>{name}</H3>
      <ul>
        {aliases.length > 0 && (
          <li>
            Alias:
            {aliases.map((alias, i) => {
              return (
                <>
                  {i > 0 ? ', ' : ''}
                  <code>{alias}</code>
                </>
              );
            })}
          </li>
        )}
        <li>
          Type: <ReactMarkdown children={typesList} disallowedTypes={['paragraph']} unwrapDisallowed skipHtml />
        </li>
        {definition.default !== undefined && (
          <li>
            Default: <code>{JSON.stringify(definition.default)}</code>
          </li>
        )}
      </ul>
      <p>
        <ReactMarkdown
          children={definition.description ?? ''}
          disallowedTypes={['paragraph']}
          unwrapDisallowed
          skipHtml
        />
      </p>
    </>
  );
}

export default OptionsRow;

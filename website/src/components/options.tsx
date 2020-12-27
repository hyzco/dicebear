import * as React from 'react';
import type { Style } from '@dicebear/avatars';
import { utils, schema } from '@dicebear/avatars';
import OptionsRow from './options-row';

type Props = {
  style?: Style<any>;
};

function Options({ style }: Props) {
  let properties = schema.properties ?? {};
  let aliases = utils.schema.aliases(schema);

  if (style) {
    properties = {
      ...properties,
      ...style.schema.properties,
    };

    aliases = { ...aliases, ...utils.schema.aliases(style.schema) };
  }

  return Object.keys(properties)
    .filter((property) => false === property in aliases)
    .map((property) => {
      let propertyAliases = Object.keys(aliases).reduce<string[]>((result, alias) => {
        if (aliases[alias] === property) {
          result.push(alias);
        }

        return result;
      }, []);

      return <OptionsRow key={property} name={property} definition={properties[property]} aliases={propertyAliases} />;
    });
}

export default Options;

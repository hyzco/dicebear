import type { JSONSchema7 } from 'json-schema';
import coreSchema from './schema.json';
import * as schemaUtils from './utils/schema';

export * from './core';
export * from './styles';
export * as utils from './utils';
export * as colors from './colors';
export * as prng from './prng';
export * as options from './options';
export * as style from './style';

export const schema = schemaUtils.resolve(coreSchema as JSONSchema7);

import type { JSONSchema7 } from 'json-schema';
import coreSchema from './schema.json';
import * as schemaUtils from './utils/schema';

export default schemaUtils.resolve(coreSchema as JSONSchema7);

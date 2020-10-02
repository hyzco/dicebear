import { schema } from '../../utils';
import coreSchema from '../../schema.json';
import styleSchema from './schema.json';
import type { StyleSchema } from '../../style';

export default schema.resolve(styleSchema as StyleSchema, [coreSchema as StyleSchema]);

import type { StyleSchema } from '@dicebear/avatars';

import { utils, schema as coreSchema } from '@dicebear/avatars';
import schema from './schema.json';

export default utils.schema.resolve(schema as StyleSchema, [coreSchema as StyleSchema]);

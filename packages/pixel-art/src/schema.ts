import type { StyleSchema } from '@dicebear/core';

import { utils, schema as coreSchema } from '@dicebear/core';
import schema from './schema.json';

export default utils.schema.resolve(schema as StyleSchema, [coreSchema as StyleSchema]);

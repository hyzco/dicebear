import type { JSONSchema7 } from 'json-schema';
import type { IPrng } from './prng';
import type { Options } from './options';

export type StyleSchema = JSONSchema7;

export interface StyleCreateProps<O> {
  prng: IPrng;
  options: O;
}

export type StyleCreate<O extends Options> = (props: StyleCreateProps<O>) => StyleCreateResult;

export interface StyleCreateResultAttributes {
  viewBox: string;
  [key: string]: string;
}

export interface StyleCreateResult {
  attributes: StyleCreateResultAttributes;
  head?: string;
  body: string;
}

export interface StyleMetaLicense {
  name: string;
  link: string;
}

export interface StyleMeta {
  title: string;
  creator: string;
  source: string;
  license: StyleMetaLicense;
}

export interface StyleColors {
  [name: string]: string;
}

export interface StylePathCreateProps {
  color?: string;
}

export type StylePathCreate = (props: StylePathCreateProps) => string;

export interface StylePath {
  create: StylePathCreate;
}

export interface StylePathCollection {
  [name: string]: StylePath;
}

export interface StylePaths {
  [type: string]: StylePathCollection;
}

export interface Style<O extends Options> {
  meta: StyleMeta;
  schema: StyleSchema;
  colors: StyleColors;
  paths: StylePaths;
  create: StyleCreate<O>;
}

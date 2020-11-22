import type { JSONSchema7 } from 'json-schema';
import type { Options } from './options';

export interface Prng {
  seed: string | undefined;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
}

export type StyleSchema = JSONSchema7;

export type StyleOptions<O extends {}> = Options & O;

export interface StyleCreateProps<O> {
  prng: Prng;
  options: StyleOptions<O>;
}

export type StyleCreate<O extends {}> = (props: StyleCreateProps<O>) => StyleCreateResult;

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
  [name: string]: Record<string, string>;
}

export interface StylePresets<O extends {}> {
  [name: string]: Partial<StyleOptions<O>>;
}

export interface Style<O extends {}> {
  meta: StyleMeta;
  schema: StyleSchema;
  colors: StyleColors;
  create: StyleCreate<O>;
  presets?: StylePresets<O>;
}

import type { JSONSchema7 } from 'json-schema';

export type IStyleDefaultOptions<O> = IOptions<O>;
export type IStyleSchema = JSONSchema7;
export type IStyleCreate<O> = (prng: IPrng, options: Partial<IOptions<O>>) => IStyleCreateResult;
export type IStyleCreateResultAttributes = {
  viewBox: string;
  [key: string]: string;
};
export type IStyleCreateResult = {
  attributes: IStyleCreateResultAttributes;
  head?: string;
  body: string;
};

export interface IStyle<O> {
  name: string;
  title: string;
  creator: string;
  source: string;
  license: {
    name: string;
    link: string;
  };
  defaultOptions: IStyleDefaultOptions<O>;
  schema: IStyleSchema;
  create: IStyleCreate<O>;
}

export type IDefaultOptions = {
  mode?: 'include' | 'exclude';
  seed?: string;
  s?: string;
  radius?: number;
  r?: number;
  dataUri?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  backgroundColor?: string;
  b?: string;
};

export type IOptions<O extends Record<string, any>> = O & IDefaultOptions;

export interface IPrng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
}

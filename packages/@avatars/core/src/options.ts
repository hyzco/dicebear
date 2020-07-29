export type IDefaultOptions = {
  seed?: string;
  radius?: number;
  r?: number;
  dataUri?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  background?: string;
  b?: string;
};

export type IOptions<O extends {}> = O & IDefaultOptions;

export function applyAliases<O extends {}>(options: IOptions<O>): IOptions<O> {
  return {
    ...{
      radius: options.r,
      width: options.w,
      height: options.h,
      margin: options.m,
      background: options.b,
    },
    ...options,
  };
}

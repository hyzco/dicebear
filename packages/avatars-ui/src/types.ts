import type { Style } from '@dicebear/avatars';

export type Mode = 'deterministic' | 'creator';
export type Modes = Mode[];
export type Styles = Style<any>[];
export type Scene = 'form' | 'mode' | 'style';

export type IconName = 'refresh' | 'download' | 'chevron-left' | 'chevron-right' | 'check';

export type ModeContext = {
  get: () => Mode,
  set: (mode: Mode) => unknown
}

export type StyleContext = {
  get: () => Style<any>,
  set: (style: Style<any>) => unknown
}

export type OptionsContext = {
  get: () => any,
  set: (options: any) => unknown
}
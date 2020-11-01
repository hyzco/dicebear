import type { Style } from '@dicebear/avatars';

export type Mode = 'deterministic' | 'creator';
export type Modes = Mode[];
export type Styles = Record<string, Style<any>>;
export type Scene = 'form' | 'mode' | 'style';

export type IconName = 'refresh' | 'download' | 'chevron-left' | 'chevron-right' | 'check';

export interface Options {
  target: HTMLElement;
  styles: Styles;
  modes?: Modes;
  locales?: Record<string, Partial<I18n>>;
  locale?: string;
  fallbackLocale?: string;
}

export interface I18n {
  modeHeadline: string;
  styleHeadline: string;
  creatorModeDescription: string;
  deterministicModeDescription: string;
}

export interface Context {
  i18n: {
    get: (key: keyof I18n) => string;
  };
  mode: {
    get: () => Mode;
    set: (mode: Mode) => unknown;
  };
  style: {
    get: () => Style<any>;
    set: (style: Style<any>) => unknown;
  };
  avatarOptions: {
    get: () => any;
    set: (options: any) => unknown;
  };
  scene: {
    get: () => Scene;
    set: (scene: Scene) => unknown;
  };
}

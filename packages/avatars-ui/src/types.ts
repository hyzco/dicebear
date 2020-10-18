import type { Style } from '@dicebear/avatars';

export type ModeTypes = 'deterministic' | 'creator';
export type Mode = ModeTypes | ModeTypes[];
export type Styles = Record<string, Style<any>>;
export type Scene = 'creator' | 'deterministic' | 'mode' | 'style';


export type IconName = 'refresh' | 'download' | 'chevron-left' | 'chevron-right' | 'check';
import type { interfaces } from '@dicebear/avatars';

export type ModeTypes = 'seed' | 'creator';
export type Mode = ModeTypes | ModeTypes[];
export type Styles = Record<string, interfaces.IStyle<any>>;

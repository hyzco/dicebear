import type { I18n } from './types';

const locales: Record<string, I18n> = {
  en_US: {
    modeHeadline: 'Choose a mode',
    styleHeadline: 'Choose a style',
    creatorModeDescription: 'Create a individual avatar piece by piece.',
    deterministicModeDescription: 'Create deterministic avatars from a seed.',
  },
};

export default locales;

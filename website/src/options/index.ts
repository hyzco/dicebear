import avataaarsOptions from './avataaars';
import botttsOptions from './bottts';
import femaleOptions from './female';
import humanOptions from './human';
import gridyOptions from './gridy';
import identiconOptions from './identicon';
import initialsOptions from './initials';
import jdenticonOptions from './jdenticon';
import maleOptions from './male';

import avataaars from '@dicebear/avatars-avataaars';
import bottts from '@dicebear/avatars-bottts';
import female from '@dicebear/avatars-pixel-art';
import human from '@dicebear/avatars-human';
import gridy from '@dicebear/avatars-gridy';
import identicon from '@dicebear/avatars-identicon';
import initials from '@dicebear/avatars-initials';
import jdenticon from '@dicebear/avatars-shapes';
import male from '@dicebear/avatars-male';
import SpriteCollection from '../types/spriteCollection';

export default [
  {
    id: 'male',
    style: male,
    options: maleOptions,
  },
  {
    id: 'female',
    style: female,
    options: femaleOptions,
  },
  {
    id: 'human',
    style: human,
    options: humanOptions,
  },
  {
    id: 'identicon',
    style: identicon,
    options: identiconOptions,
  },
  {
    id: 'initials',
    style: initials,
    options: initialsOptions,
  },
  {
    id: 'bottts',
    style: bottts,
    options: botttsOptions,
  },
  {
    id: 'avataaars',
    style: avataaars,
    options: avataaarsOptions,
  },
  {
    id: 'jdenticon',
    style: jdenticon,
    options: jdenticonOptions,
  },
  {
    id: 'gridy',
    style: gridy,
    options: gridyOptions,
  },
] as SpriteCollection[];

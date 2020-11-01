import { createAvatarUI } from '.';
import * as micah from '@dicebear/avatars-micah';

createAvatarUI({
  target: document.body,
  modes: ['creator', 'deterministic'],
  styles: { micah },
});

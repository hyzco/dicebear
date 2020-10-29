import app from '.';
import { micah } from '@dicebear/avatars';

export default app({
  target: document.body,
  modes: ['creator', 'deterministic'],
  styles: [micah],
});

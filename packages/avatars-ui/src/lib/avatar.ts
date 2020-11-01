import type { Style, Options } from '@dicebear/avatars';

import { createAvatar } from '@dicebear/avatars';

export function createPreviewAvatar<O extends Options>(style: Style<O>, options: O): string {
  return createAvatar(style, {
    ...options,
    width: undefined,
    height: undefined,
    dataUri: true,
  });
}

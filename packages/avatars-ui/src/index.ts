import type { Options } from './types';

import App from './components/App.svelte';

export const createAvatarUI = (options: Options) => {
  let { target, ...rest } = options;

  return new App({
    target,
    props: {
      options: rest,
    },
  });
};

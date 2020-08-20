import App from './components/App.svelte';
import type { Mode, Styles } from './types';

type Options = {
  target: Element;
  withWrapper?: boolean;
  mode?: Mode;
  styles: Styles;
};

export default (options: Options) => {
  let { target, ...props } = options;

  return new App({
    target,
    props,
  });
};

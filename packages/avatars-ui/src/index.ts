import App from './components/App.svelte';
import type { Modes, Styles } from './types';

type Options = {
  target: Element;
  modes?: Modes;
  styles: Styles;
};

export default (options: Options) => {
  let { target, ...props } = options;

  return new App({
    target,
    props,
  });
};

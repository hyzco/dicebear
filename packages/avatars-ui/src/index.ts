import App from './components/App.svelte';
import type { I18n, Modes, Styles } from './types';

type Options = {
  target: Element;
  modes?: Modes;
  styles: Styles;
  i18n?: I18n;
};

export default (options: Options) => {
  let { target, ...props } = options;

  return new App({
    target,
    props,
  });
};

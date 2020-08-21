import { getUmdConfig, getCjsAndEsConfig } from '../../build/utils';
import pkg from './package.json';

const watch = !!process.env.ROLLUP_WATCH;

export default async () => {
  if (watch) {
    return [
      getUmdConfig(pkg, {
        svelte: true,
        watch: true,
      }),
    ];
  }

  return [
    getUmdConfig(pkg, {
      svelte: true,
    }),
    getCjsAndEsConfig(pkg, {
      svelte: true,
    }),
  ];
};

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import builtins from 'rollup-plugin-node-builtins';
import typescript from '@rollup/plugin-typescript';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

const watch = !!process.env.ROLLUP_WATCH;
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default async () => {
  return [
    {
      input: watch ? './src/watch.ts' : './src/index.ts',
      plugins: [
        svelte({
          preprocess: sveltePreprocess({ postcss: true, dev: watch }),
        }),
        builtins(),
        resolve({ extensions, dedupe: ['svelte'], browser: true }),
        commonjs(),
        typescript(),
        babel({ extensions, include: ['src/**/*'] }),
        ...(watch
          ? [serve(), livereload('public')]
          : [
              terser(),
              visualizer({
                open: true,
                sourcemap: true,
                gzipSize: true,
              }),
            ]),
      ],
      output: [
        {
          file: watch ? 'public/build/bundle.js' : pkg.browser,
          format: 'umd',
          name: 'AvatarsUI',
          exports: 'named',
          sourcemap: true,
        },
      ],
      watch: {
        clearScreen: false,
      },
    },
    ...(watch
      ? []
      : [
          {
            input: './src/index.ts',
            plugins: [
              svelte({
                preprocess: sveltePreprocess({ postcss: true }),
              }),
              resolve({ extensions }),
              typescript(),
              babel({ extensions, include: ['src/**/*'] }),
              autoExternal(),
            ],
            output: [
              {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
              },
              {
                file: pkg.module,
                format: 'es',
                exports: 'named',
              },
            ],
          },
        ]),
  ];
};

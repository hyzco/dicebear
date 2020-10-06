import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';
import builtins from 'rollup-plugin-node-builtins';
import typescript from '@rollup/plugin-typescript';
import visualizer from 'rollup-plugin-visualizer';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default async () => {
  return [
    {
      input: './src/index.ts',
      plugins: [
        json(),
        builtins(),
        resolve({ extensions, dedupe: ['svelte'], browser: true }),
        commonjs(),
        typescript(),
        babel({ extensions, include: ['src/**/*'] }),
        terser(),
        visualizer({
          open: true,
          sourcemap: true,
          gzipSize: true,
        }),
      ],
      output: [
        {
          file: pkg.browser,
          format: 'umd',
          name: 'Avatars',
          exports: 'named',
          sourcemap: true,
        },
      ],
    },
    {
      input: './src/index.ts',
      plugins: [
        json(),
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
  ];
};

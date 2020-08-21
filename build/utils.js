import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';
import bannerPlugin from 'rollup-plugin-banner';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import builtins from 'rollup-plugin-node-builtins';
import typescript from '@rollup/plugin-typescript';

export function getPackages(packageName, deep = true, filter = []) {
  let pkg = require(`${packageName}/package.json`);
  let licenses = {};
  let author = undefined;

  if (pkg.author) {
    if (typeof pkg.author === 'string') {
      author = pkg.author;
    } else {
      author = pkg.author.name;

      if (pkg.author.email) {
        author += ` <${pkg.author.email}>`;
      }

      if (pkg.author.url) {
        author += ` (${pkg.author.url})`;
      }
    }
  }

  licenses[pkg.name] = {
    name: pkg.name,
    version: pkg.version,
    homepage: pkg.homepage,
    author: author,
    license: pkg.license,
  };

  if (deep) {
    let dependencies = Object.keys(pkg.dependencies || {}).filter(
      (dependency) => false === filter.includes(dependency)
    );

    filter = [...filter, ...dependencies];

    dependencies.forEach((dependency) => {
      licenses = {
        ...licenses,
        ...getPackages(dependency, deep, filter),
      };
    });
  }

  return licenses;
}

export function createLicenseText(pkg) {
  let rows = [];

  rows.push(`${pkg.name}:`);

  if (pkg.license) {
    rows.push(`  license: ${pkg.license}`);
  } else {
    console.warn(`${pkg.name} has no license!`);
  }

  if (pkg.author) {
    rows.push(`  author: ${pkg.author}`);
  }

  if (pkg.homepage) {
    rows.push(`  homepage: ${pkg.homepage}`);
  }

  return rows.join('\n');
}

export function createBanner(pkgName, deep = true) {
  let packages = getPackages(pkgName, deep);

  return Object.values(packages).map(createLicenseText).join('\n\n');
}

export function getUmdName(pkgName) {
  return pkgName.replace('@dicebear/', '').split('-').map(ucfirst).join('');
}

export function ucfirst(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function getExtensions() {
  return ['.js', '.jsx', '.ts', '.tsx'];
}

export function getConfigDefaults() {
  return {
    watch: false,
    svelte: false,
  };
}

export function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export function getUmdConfig(pkg, config = {}) {
  let extensions = getExtensions();

  config = {
    ...getConfigDefaults(),
    ...config,
  };

  let plugins = [];

  if (config.svelte) {
    plugins.push(
      svelte({
        preprocess: sveltePreprocess({ postcss: true, dev: config.watch }),
      })
    );
  }

  plugins.push(
    resolve({ extensions, dedupe: ['svelte'], browser: true }),
    commonjs(),
    typescript(),
    //builtins(),
    babel({ extensions, include: ['src/**/*'] })
  );

  if (config.watch) {
    plugins.push(serve(), livereload('public'));
  } else {
    plugins.push(bannerPlugin(createBanner(pkg.name)), terser());
  }

  return {
    input: config.watch ? './src/watch.ts' : './src/index.ts',
    plugins,
    output: [
      {
        file: config.watch ? 'public/build/bundle.js' : pkg.browser,
        format: 'umd',
        name: getUmdName(pkg.name),
        exports: 'named',
        sourcemap: config.watch,
      },
    ],
    external: ['crypto'],
    watch: {
      clearScreen: false,
    },
  };
}

export function getCjsAndEsConfig(pkg, config = {}) {
  let extensions = getExtensions();

  config = {
    ...getConfigDefaults(),
    ...config,
  };

  let plugins = [];

  if (config.svelte) {
    plugins.push(
      svelte({
        preprocess: sveltePreprocess({ postcss: true }),
      })
    );
  }

  plugins.push(
    resolve({ extensions }),
    typescript(),
    babel({ extensions, include: ['src/**/*'] }),
    autoExternal(),
    bannerPlugin(createBanner(pkg.name, false))
  );

  return {
    input: './src/index.ts',
    plugins,
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
  };
}

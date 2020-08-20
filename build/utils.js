import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';
import bannerPlugin from 'rollup-plugin-banner';

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

export function getUmdConfig(pkg, config = {}) {
  let extensions = getExtensions();
  return {
    input: './src/index.ts',
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({ extensions, include: ['src/**/*'] }),
      terser(),
      bannerPlugin(createBanner(pkg.name)),
    ],
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name: getUmdName(pkg.name),
        exports: 'named',
      },
    ],
    ...config,
  };
}

export function getCjsAndEsConfig(pkg, config = {}) {
  let extensions = getExtensions();

  return {
    input: './src/index.ts',
    plugins: [
      resolve({ extensions }),
      babel({ extensions, include: ['src/**/*'] }),
      autoExternal(),
      bannerPlugin(createBanner(pkg.name, false)),
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
    ...config,
  };
}

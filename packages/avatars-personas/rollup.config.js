import pkg from './package.json';
import { getUmdConfig, getCjsAndEsConfig } from '../../build/utils';

export default async () => {
  return [getUmdConfig(pkg, { external: ['crypto'] }), getCjsAndEsConfig(pkg)];
};

#!/usr/bin/env node

import sade from 'sade';
import pkg from '../package.json';

import optionsBuildCommand from './commands/options/build';
import styleInitCommand from './commands/style/init';

const name = Object.keys(pkg.bin)[0];
const prog = sade(name);

prog.version(pkg.version);

prog
  .command('options:build')
  .describe('Generates option types from JSON schema files.')
  .option('-i, --input', 'Changes the path to the JSON schema files.', './src/**/schema.json')
  .example(`${name} options:build`)
  .example('${name} options:build -i ./path/to/schema.json')
  .action(optionsBuildCommand);

prog
  .command('style:init <target>')
  .describe('Creates a new avatar style project.')
  .example(`${name} style:init foo`)
  .action(styleInitCommand);

prog.parse(process.argv);

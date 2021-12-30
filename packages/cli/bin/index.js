#! /usr/bin/env node
require('module-alias/register')
const importLocal = require('import-local');
const { Cli } = require('../lib').default;
if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用@cashrain/cli本地版本')
} else {
  const shell = process.argv[1].slice(process.argv[1].lastIndexOf('/') + 1)
  new Cli(shell, process.argv.slice(2)).run();
}
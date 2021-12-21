#! /usr/bin/env node

const importLocal = require('import-local');
const { Cli } = require('../dist').default;
console.log(Cli)
if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用web-cli-dev本地版本')
} else {
  console.log(new Cli(process.argv.slice(2)).run())
}
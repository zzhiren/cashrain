'use strict';

const semver = require('semver');
const colors = require('colors');

import log from '@utils/log';
import { isObject } from '@utils/common';
import { LOWEST_NODE_VERSION, HEADING } from '../constant';


export default class Command<T> {
  command: T;
  constructor(command: T) {
    if (!command) {
      throw new Error('参数不能为空！');
    }
    if (!isObject(command)) {
      throw new Error('参数必须为对象！');
    }

    if (Object.keys(command).length < 1) {
      throw new Error('参数列表为空！');
    }
    this.command = command;
    let chain = Promise.resolve();
    chain = chain.then(() => this.checkNodeVersion());
    chain = chain.then(() => this.init());
    chain = chain.then(() => this.exec());
    chain.catch(err => {
      log.error(err.message);
    });
  }

  /**
   * @desc 检查node版本
   */
  public checkNodeVersion() {
    // 1.拿到当前node版本号
    // 2.比对最低版本号
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gt(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`@${HEADING}/cli 需要安装 ${lowestVersion} 以上版本的 Node.js！`));
    }
  }

  public init() {
    throw new Error('init 必须实现');
  }

  public exec() {
    throw new Error('exec 必须实现');
  }
}


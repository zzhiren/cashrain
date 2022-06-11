import { IInitCommand } from '@models/init';

const inquirer = require('inquirer');

import log from '@utils/log';
import { GetCommandOptions } from '@utils/command';
import { IInitPackage, INIT_PACKAGE } from '@constant';
import {
  Taro,
  Vue,
  Touch
} from '@commands/index';

class Exec {
  command: IInitCommand;
  commandConfig = {
    vue: Vue,
    taro: Taro,
    touch: Touch
  };

  constructor (cmdArgv: { [propName: string]: any }) {
    this.command = GetCommandOptions.getOptions(cmdArgv);
    log.verbose('this.command', this.command);
  }

  /**
   * 初始化工程
   */
  public async init() {
    let command;
    if (this.command.name === 'init') {
      command = (await this.chooseCommand()).command;
    } else {
      command = INIT_PACKAGE.find(v => v.packageName === this.command.name);
    }
    log.verbose('command', command);
    if (!command.isNpmPkg) {
      this.commandConfig[command.packageName](this.command);
    } else {
      /* TODO 加载npm包并执行 */

    }
  }

  /**
   * 创建文件
   */
  public async touch() {
    this.commandConfig['touch'](this.command);
  }

  public async chooseCommand(): Promise<{ command: IInitPackage }> {
    return inquirer.prompt({
      type: 'list',
      name: 'command',
      message: '请选择项目初始化类型',
      default: INIT_PACKAGE[0],
      choices: INIT_PACKAGE.map(v => ({ name: `${v.packageName}(${v.description})`, value: v }))
    });
  }
}

export function init () {
  new Exec(arguments).init();
}

export function touch() {
  new Exec(arguments).touch();
}
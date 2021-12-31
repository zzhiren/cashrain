const inquirer = require('inquirer');

import log from '@utils/log';
import { GetCommandOptions } from '@utils/command';
import { INIT_PACKAGE } from '@constant';
import {
  Taro,
  Vue
} from '@commands/index';

class Exec {
  command: NInit.Command;
  commandConfig = {
    vue: Vue,
    taro: Taro
  };

  constructor (cmdArgv: { [propName: string]: any }) {
    this.command = GetCommandOptions.getOptions(cmdArgv);
    log.verbose('this.command', this.command);
  }

  public async run() {
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
      /* TODO 加载npm包进行初始化 */

    }
  }

  public async chooseCommand(): Promise<{ command: Constant.InitPackage }> {
    return inquirer.prompt({
      type: 'list',
      name: 'command',
      message: '请选择项目初始化类型',
      default: INIT_PACKAGE[0],
      choices: INIT_PACKAGE.map(v => ({ name: `${v.packageName}(${v.description})`, value: v }))
    });
  }
}

export default function () {
  new Exec(arguments).run();
}
import Init, { IInitCommand, ITaroProject } from '@models/init';

const inquirer = require('inquirer');

import log from '@utils/log';
import { TaroTemplate, PromptConfig } from '@constant';
import { isValidName, formatDate } from '@utils/common';
class Taro extends Init<ITaroProject> {
  projectInfo: ITaroProject = {
    projectName: '',
    projectVersion: '',
    description: '',
    date: '',
    appId: ''
  };

  constructor (command: IInitCommand) {
    super(command, TaroTemplate);
  }

  public init() {
    if (isValidName(this.command.projectName)) {
      this.projectInfo.projectName = this.command.projectName;
    } else {
      log.error(`项目名称: '${this.command.projectName}' 不合法！`);
    }
    log.verbose('this.projectInfo', this.projectInfo);
  }

  public async exec() {
    await super.exec();
  }

  public async getProjectCustomInfo() {
    // 微信appid
    const { appId } = await inquirer.prompt(PromptConfig.appId);
    return {
      ...this.projectBaseInfo,
      appId,
      date: formatDate('yyyy-MM-dd')
    };
  }
}

export default function (props) {
  // tslint:disable-next-line:no-unused-expression
  new Taro(props);
}
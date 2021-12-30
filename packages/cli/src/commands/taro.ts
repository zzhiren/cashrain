import Init from '@models/init';

const inquirer = require('inquirer');

import log from '@utils/log';
import { TaroTemplate, PromptConfig } from '@constant';
import { isValidName, formatDate } from '@utils/common';
class Taro extends Init {
  projectInfo: NInit.TaroProject = {
    projectName: '',
    projectVersion: '',
    description: '',
    date: '',
    appId: ''
  };
  // templateInfo: Constant.Template = {
  //   name: '',
  //   npmName: '',
  //   version: '',
  //   type: '',
  //   installCommand: '',
  //   startCommand: '',
  //   tag: [],
  //   ignore: []
  // };
  // force: boolean = false;

  constructor (command: NInit.Command) {
    super(command);
  }

  public init() {
    this.force = this.command.options.force;
    if (isValidName(this.command.projectName)) {
      this.projectInfo.projectName = this.command.projectName;
    } else {
      log.error(`项目名称: '${this.command.projectName}' 不合法！`);
    }
    log.verbose('this.projectInfo', this.projectInfo);
  }

  public async exec() {
    try {
      await this.checkDir();
      this.projectBaseInfo = await this.getProjectBaseInfo();
      this.projectInfo = await this.getProjectCustomInfo();
      this.templateInfo = await this.chooseTemplate(PromptConfig.projectTemplate(TaroTemplate));
      await this.downloadTemplate();
      await this.installTemplate();
      await this.ejsRender(this.projectInfo);
      const { installCommand, startCommand } = this.templateInfo;
      // 依赖安装
      await this.execCommand(installCommand, '依赖安装失败！');
      // 启动命令执行
      await this.execCommand(startCommand, '启动执行命令失败！');
      log.verbose('projectInfo', this.projectInfo);
    } catch (e) {
      throw e;
    }
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
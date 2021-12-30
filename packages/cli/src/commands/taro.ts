const inquirer = require('inquirer');
const fse = require('fs-extra');

import Command from '@models/command';
import log from '@utils/log';
import { TaroTemplate, PromptConfig } from '@constant';
import { dirIsEmpty, isValidName, formatDate } from '@utils/common';
class Taro extends Command<Init.Command>{
  projectInfo: Init.TaroProject = {
    projectName: '',
    projectVersion: '',
    description: '',
    date: '',
    appId: ''
  };
  templateInfo: Constant.Template = {
    name: '',
    npmName: '',
    version: '',
    type: '',
    installCommand: '',
    startCommand: '',
    tag: [],
    ignore: []
  };
  force: boolean = false;

  constructor (command: Init.Command) {
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
      await this.prepare();
      const projectInfo = await this.getProjectInfo();
      this.templateInfo = await this.chooseTemplate();
      await this.downloadTemplate();
      log.verbose('projectInfo', projectInfo);
    } catch (e) {
      console.log(e);
    }
  }

  public async prepare() {
    // 判断当前目录是否为空
    const localPath = process.cwd();
    let emptyDir = false;
    if (!dirIsEmpty(localPath)) {
      log.verbose('目录不为空');
      if (!this.force) {
        emptyDir = (await inquirer.prompt(PromptConfig.emptyDir)).emptyDir;
        if (!emptyDir) {
          return;
        }
      }

      if (emptyDir || this.force) {
        const { confirmEmptyDir } = await inquirer.prompt(PromptConfig.confirmEmptyDir);
        if (confirmEmptyDir) {
          // 清空当前目录
          fse.emptyDirSync(localPath);
        }
      }
    }
  }

  public async getProjectInfo() {
    let projectName;
    // 项目名称
    if (!this.projectInfo.projectName) {
      projectName = (await inquirer.prompt(PromptConfig.projectName)).projectName;
    }
    // 项目版本
    const { projectVersion } = await inquirer.prompt(PromptConfig.projectVersion);
    // 微信AppId
    const { appId } = await inquirer.prompt(PromptConfig.appId);
    console.log(new Date());
    return {
      projectName: projectName || this.projectInfo.projectName,
      projectVersion,
      appId,
      date: formatDate('yyyy-MM-dd')
    };
  }

  public async chooseTemplate() {
    const { projectTemplate } = await inquirer.prompt(PromptConfig.projectTemplate(TaroTemplate));
    return projectTemplate;
  }

  public async downloadTemplate() {}
}

export default function (props) {
  // tslint:disable-next-line:no-unused-expression
  new Taro(props);
}
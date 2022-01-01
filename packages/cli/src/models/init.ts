'use strict';

const path = require('path');
const inquirer = require('inquirer');
const userHome = require('user-home');
const glob = require('glob');
const ejs = require('ejs');

import * as fse from 'fs-extra';
import Package from '@models/package';
import log from '../utils/log';
import Command from '@models/command';
import {
  dirIsEmpty,
  isValidName,
  spinnerStart,
  sleep,
  oraSpinner
} from '@utils/common';
import { execAsync } from '@utils/exec';
import {
  PromptConfig,
  TEMPLATE_TYPE_NORMAL,
  TEMPLATE_TYPE_CUSTOM,
  WHITE_COMMAND
} from '../constant';


export default class Init extends Command<NInit.Command>{
  projectBaseInfo: NInit.ProjectBaseInfo = {
    projectName: '',
    projectVersion: '',
    description: ''
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

  templatePackage;
  force: boolean = false;

  constructor (command: NInit.Command) {
    super(command);
    this.force = this.command.options.force;
    if (isValidName(this.command.projectName)) {
      this.projectBaseInfo.projectName = this.command.projectName;
    } else {
      log.error(`项目名称: '${this.command.projectName}' 不合法！`);
    }
    log.verbose('this.projectBaseInfo', this.projectBaseInfo);
  }


  /**
   * 检查当前目录是否为空，如果为空，则询问是否清空目录
   */
  public async checkDir() {
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
          const spinner = oraSpinner('清空目录中...');
          try {
            // 清空当前目录
            await fse.emptyDir(localPath);
            spinner.stop();
          } catch (e) {
            spinner.fail(e);
          }
        }
      }
    }
  }

  /**
   * 获取项目基本信息
   * @returns {
   *   projectName: string
   *   projectVersion: string
   *   description: string
   * }
   */
  public async getProjectBaseInfo(): Promise<NInit.ProjectBaseInfo> {
    let { projectName } = this.projectBaseInfo;
    // 项目名称
    if (!projectName) {
      projectName = (await inquirer.prompt(PromptConfig.projectName)).projectName;
    }
    // 项目版本
    const { projectVersion } = await inquirer.prompt(PromptConfig.projectVersion);
    const { description } = await inquirer.prompt(PromptConfig.description);
    return {
      projectName,
      projectVersion,
      description
    };
  }

  /**
   * 选择项目模板
   * @returns Constant.Template
   */
  public async chooseTemplate(prompt): Promise<Constant.Template> {
    try {
      const { projectTemplate } = await inquirer.prompt(prompt);
      return projectTemplate;
    } catch (e) {
      throw e;
    }
  }

  public async downloadTemplate() {
    const { npmName, version } = this.templateInfo;
    const templatePath = path.resolve(userHome, '.cashrain-cli', 'template');
    const storeDir = path.resolve(userHome, '.cashrain-cli', 'template', 'node_modules');
    const templatePackage = new Package({
      targetPath: templatePath,
      storeDir,
      packageName: npmName,
      packageVersion: version
    });

    if(!await templatePackage.exists()) {
      const spinner = oraSpinner('正在下载模板...');
      await sleep();
      try {
        await templatePackage.install();
      } catch (e) {
        throw e;
      } finally {
        if (await templatePackage.exists()) {
          spinner.succeed('下载模板成功');
          this.templatePackage = templatePackage;
        }
      }
    } else {
      const spinner = oraSpinner('正在更新模板...');
      await sleep();
      try {
        await templatePackage.update();
      } catch (e) {
        throw e;
      } finally {
        if (await templatePackage.exists()) {
          spinner.succeed('更新模板成功');
          this.templatePackage = templatePackage;
        }
      }
    }
  }

  public async installTemplate() {
    log.verbose('this.templateInfo', this.templateInfo);
    const { type } = this.templateInfo;
    if (this.templateInfo) {
      if (type === TEMPLATE_TYPE_NORMAL) {
        await this.installNormalTemplate();
      } else if (type === TEMPLATE_TYPE_CUSTOM) {
        await this.installCustomTemplate();
      } else {
        throw new Error('无法识别项目模板类型！');
      }
    } else {
      throw new Error('项目模板信息不存在！');
    }
  }

  public async installNormalTemplate() {
    log.verbose('this.templatePackage', this.templatePackage);
    // 拷贝模板代码至当前目录
    const spinner = spinnerStart('正在安装模板...');
    try {
      const templatePath = path.resolve(this.templatePackage.cacheFilePath, 'template');
      const targetPath = process.cwd();
      fse.ensureDirSync(templatePath);
      fse.ensureDirSync(targetPath);
      fse.copySync(templatePath, targetPath);
    } catch (e) {
      throw e;
    } finally {
      spinner.stop(true);
      log.success('模板安装成功');
    }


  }

  public async installCustomTemplate() {
    // TODO
  }

  public async ejsRender(projectInfo) {
    const templateIgnore = this.templateInfo.ignore || [];
    const ignore = ['**/node_modules/**', ...templateIgnore];
    const rootDir = process.cwd();
    return new Promise((resolve, reject) => {
      glob('**', {
        cwd: rootDir,
        ignore: ignore || '',
        nodir: true
      }, function(err, files) {
        if (err) {
          reject(err);
        }
        Promise.all(files.map(file => {
          const filePath = path.join(rootDir, file);
          return new Promise((resolve1, reject1) => {
            ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
              if (err) {
                reject1(err);
              } else {
                fse.writeFileSync(filePath, result);
                resolve1(result);
              }
            });
          });
        })).then(() => {
          resolve(true);
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

  public async execCommand(command, errMsg) {
    let ret;
    if (command) {
      const cmdArray = command.split(' ');
      const cmd = this.checkCommand(cmdArray[0]);
      if (!cmd) {
        throw new Error('命令不存在！命令：' + command);
      }
      const args = cmdArray.slice(1);
      ret = await execAsync(cmd, args, {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    }
    if (ret !== 0) {
      throw new Error(errMsg);
    }
    return ret;
  }

  public checkCommand(cmd) {
    if (WHITE_COMMAND.includes(cmd)) {
      return cmd;
    }
    return null;
  }
}


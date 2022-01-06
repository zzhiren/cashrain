
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExistSync = require('path-exists').sync;
const path = require('path');
const rootCheck = require('root-check');
const dotEnv = require('dotenv');
const pkg: Pkg = require('../../package.json');


import { Command } from 'commander';
import { getNpmSemverVersions } from '@utils/npm';
import { DEFAULT_CLI_HOME } from '../constant';

import {
  init,
  touch
} from '@core/exec';
import log from '@utils/log';


export default class Cli {
  shell: string = 'cashrain';
  cmdOptions: string[] = [];
  program: Command = new Command();

  public constructor(shell: string, cmdOptions: string[]) {
    this.shell = shell;
    this.cmdOptions = cmdOptions;
  }

  public async run() {
    try {
      const welcome = this.shell === 'cash' ? '钱多多' : this.shell === 'rain' ? '小雨' : '';
      welcome && log.welcome(`${welcome}帮您创建工程~~~`);
      await this.prepare();
      /* 命令注册 */
      this.registerCommand();
    } catch (e) {
      // @ts-ignore
      log.error(e.message);
    }
  }

  public async prepare() {
    // 检查包版本
    this.checkPkgVersion();
    // 检查root权限
    this.checkRoot();
    // 检查用户主目录
    this.checkUserHome();
    // 检查环境变量
    this.checkEnv();
    // 检查npm包版本
    await this.checkGlobalUpdate();
  }

  public registerCommand() {
    this.program
      .name(Object.keys(pkg.bin)[0])
      .usage('<command> [options]')
      .name(Object.keys(pkg.bin)[1])
      .usage('<command> [options]')
      .name(Object.keys(pkg.bin)[2])
      .usage('<command> [options]')
      .version(pkg.version)
      .option('-d, --debug', '是否开启调式模式', false);

    this.program
      .command('init [projectName]')
      .description('初始化项目')
      .option('-f, --force', '是否开启强制初始化项目', false)
      .action(init);

    this.program
      .command('vue [projectName]')
      .description('初始化Vue项目')
      .option('-f, --force', '是否开启强制初始化项目', false)
      .action(init);

    this.program
      .command('taro [projectName]')
      .description('初始化Taro项目')
      .option('-f, --force', '是否开启强制初始化项目', false)
      .action(init);

    this.program
      .command('touch [fileType] [filePath]')
      .description('创建文件')
      .option('-y, --yes', '是否使用默认文件模板', false)
      .action(touch);

    /* 监听debug */
    this.program.on('option:debug',  () => {
      if (this.program.opts().debug) {
        process.env.LOG_LEVEL = 'verbose';
      } else {
        process.env.LOG_LEVEL = 'info';
      }
      log.level = process.env.LOG_LEVEL;
      log.verbose('开启Debug模式！');
    });

    /* TODO 监听targetPath */
    this.program.on('option:targetPath',  () => {
      process.env.CLI_TARGET_PATH = this.program.opts().targetPath;
    });

    /* 对未知命令的监听 */
    this.program.on('command:*',  (obj) => {
      const availableCommands = this.program.commands.map((cmd) => cmd.name());
      console.log(colors.red('未知命令:' + obj[0]));
      if (availableCommands.length > 0) {
        console.log(colors.red('可用命令:' + availableCommands.join(',')));
      }
    });

    this.program.parse(process.argv);

    /* 如果没有命令参数，则打印帮助文档 */
    if (this.program.args && this.program.args.length < 1) {
      this.program.outputHelp();
    }
  }

  public checkPkgVersion() {
    log.version('@cashrain/cli version:', pkg.version);
  }

  public checkRoot() {
    rootCheck();
  }

  public checkUserHome() {
    /** 是否存在主目录 */
    if (!userHome || !pathExistSync(userHome)) {
      throw new Error(colors.red('当前用户主目录不存在！'));
    }
  }

  public checkEnv() {
    const dotEnvPath = path.resolve(userHome, '.env');
    if (pathExistSync(dotEnvPath)) {
      dotEnv.config({
        path: dotEnvPath
      });
    }

    this.createDefaultConfig();
  }

  public async checkGlobalUpdate() {
    // 1. 获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 2. 调用npm API，获取所有版本号
    const lastVersion = await getNpmSemverVersions(currentVersion, npmName);
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
      log.warn(
        colors.yellow(
          `请手动更新${npmName}，最新版本为${lastVersion}，当前版本为${currentVersion}，更新命令 npm install -g ${npmName}`
        )
      );
    }
    // 3. 提取所有版本号，比对哪些版本号是大于当前版本号的
    // 4. 获取最新的版本号，提示用户更新到该版本
  }

  /**
   * @desc 创建默认配置
   * @returns {{home: *|{}}}
   */
  public createDefaultConfig() {
    const cliConfig = {
      home: userHome,
      cliHome: ''
    };

    if (process.env.CLI_HOME) {
      cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
      cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME);
    }

    process.env.CLI_HOME_PATH = cliConfig.cliHome;

    return cliConfig;
  }

}

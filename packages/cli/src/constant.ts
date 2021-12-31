export const DEFAULT_CLI_HOME: string = '.cashrain-cli';
export const NPM_NAME: string = '@cashrain/cli';
export const DEPENDENCIES_PATH: string = 'dependencies';
export const LOWEST_NODE_VERSION: string = '13.0.0';
export const HEADING: string = 'cashrain';

export const INIT_PACKAGE: Constant.InitPackage[] = [
  {
    packageName: 'vue',
    version: '',
    description: '初始化Vue项目',
    isNpmPkg: false
  },
  {
    packageName: 'taro',
    version: '',
    description: '初始化Taro项目',
    isNpmPkg: false
  }
];
export const TEMPLATE_TYPE_NORMAL: string = 'normal';
export const TEMPLATE_TYPE_CUSTOM: string = 'custom';
export const WHITE_COMMAND = ['npm', 'cnpm'];

export const PromptConfig = {
  emptyDir: {
    type: 'confirm',
    name: 'emptyDir',
    default: false,
    message: '当前文件夹不为空，是否创建项目?'
  },
  confirmEmptyDir: {
    type: 'confirm',
    name: 'confirmEmptyDir',
    default: false,
    message: '是否确认清空当前目录下的文件?'
  },
  projectName: {
    type: 'input',
    name: 'projectName',
    message: `请输入项目名称`,
    validate: function (v) {
      // 1.首字符必须为字符
      // 2.尾字符必须为字符
      // 3.特殊字符只允许'-','_'两种
      // 合法：a, a-b, abc, a-b1, a_b1, a-b1-c1, a_b_c
      // 不合法：1, a_, a-, a-1, a_1
      // @ts-ignore
      const done = this.async();

      // Do async stuff
      setTimeout(function () {
        if (
          !/^[a-zA-Z]+(([-]|[_])[a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
        ) {
          // Pass the return value in the done callback
          done(`请输入合法的项目名称！`);
          return;
        }
        // Pass the return value in the done callback
        done(null, true);
      }, 0);
    },
    filter: function (v) {
      return v;
    }
  },
  projectVersion: {
    type: 'input',
    name: 'projectVersion',
    message: `请输入项目版本号`,
    default: '1.0.0',
    validate: function (v) {
      // @ts-ignore
      const done = this.async();
      setTimeout(function () {
        if (!require('semver').valid(v)) {
          done('请输入合法的版本号');
          return;
        }
        done(null, true);
      }, 0);
    },
    filter: function (v) {
      return !require('semver').valid(v) ? v : require('semver').valid(v);
    }
  },
  description: {
    type: 'input',
    name: 'description',
    message: `请输入项目描述信息`,
    default: '',
    validate: function (v) {
      // @ts-ignore
      const done = this.async();
      setTimeout(function () {
        if (!v) {
          done('请输入描述信息！');
          return;
        }
        done(null, true);
      }, 0);
    }
  },
  appId: {
    type: 'input',
    name: 'appId',
    message: `请输入微信AppId`,
    default: '',
    validate: function (v) {
      // @ts-ignore
      const done = this.async();
      setTimeout(function () {
        if (!v) {
          done('请输入合法的微信AppId');
          return;
        }
        done(null, true);
      }, 0);
    }
  },
  projectTemplate: function (
    templateList: Constant.Template[],
    title: string = '项目'
  ) {
    return {
      type: 'list',
      name: 'projectTemplate',
      message: `请选择${title}模板`,
      choices: templateList.map((item) => ({
        value: item,
        name: item.name
      }))
    };
  }
};

export const TaroTemplate: Constant.Template[] = [
  {
    name: 'Taro Typescript Class模板',
    npmName: '@cashrain/taro-typescript-class-template',
    version: '0.0.4',
    type: 'normal',
    installCommand: 'npm install',
    startCommand: 'npm run dev:weapp',
    tag: ['project'],
    ignore: ['**/public/**']
  }
];

export const VueTemplate: Constant.Template[] = [
  {
    name: 'vue2标准模板',
    npmName: '@cashrain/vue2-standard-template',
    version: '1.0.0',
    type: 'normal',
    installCommand: 'npm install',
    startCommand: 'npm run serve',
    tag: ['project'],
    ignore: ['**/public/**']
  }
];

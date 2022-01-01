declare namespace NInit {
  interface Command {
    /* 命令名称 */
    name: string
    /* 项目名称 */
    projectName: string
    /* 命令options */
    options: {
      /* 是否强制初始化，会清空当前目录 */
      force: boolean
      /* 是否开启debug模式，开启后会打印log日志 */
      debug: boolean
    }
  }

  interface ProjectBaseInfo {
    /* 项目名称 */
    projectName: string
    /* 项目版本 */
    projectVersion: string
    /* 项目描述信息 */
    description: string
  }

  interface TaroProject extends ProjectBaseInfo {
    /* 日期 */
    date: string
    /* 微信AppId */
    appId: string
  }

  interface VueProject extends ProjectBaseInfo {

  }
}
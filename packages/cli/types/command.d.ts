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
    projectName: string
    projectVersion: string
    description: string
  }

  interface TaroProject extends ProjectBaseInfo{
    date: string
    appId: string
  }
}
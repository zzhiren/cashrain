export interface IBaseCommand {
  /* 命令名称 */
  name: string
  /* 命令options */
  options: {
    /* 是否强制初始化，会清空当前目录 */
    force: boolean
    /* 是否开启debug模式，开启后会打印log日志 */
    debug: boolean
  }
}
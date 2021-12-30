declare namespace Constant {
  /**
   * Init Command配置，可以选择不同的初始化命令，支持本地cli的文件和npm包
   */
  interface InitPackage {
    /* isNpmPkg为false时为模块文件名称否则为npm包名称 */
    packageName: string
    /* 如果为npm包则表示包版本 */
    version: string
    /* 描述信息 */
    description: string
    /* 是否为npm包 */
    isNpmPkg: boolean
  }

  interface Template {
    name: string
    npmName: string
    version: string
    type: string
    installCommand: string
    startCommand: string
    tag: string[]
    ignore: string[]
  }
}

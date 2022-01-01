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
    /* 模板名称 */
    name: string
    /* npm包名称 */
    npmName: string
    /* 版本 */
    version: string
    /* 项目类型 normal|component */
    type: string
    /* 安装命令 */
    installCommand: string
    /* 启动命令 */
    startCommand: string
    /* 标签 */
    tag: string[]
    /* 忽略文件 */
    ignore: string[]
  }
}

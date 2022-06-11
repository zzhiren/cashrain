import { IBaseCommand } from '../../types/base';

export interface Command extends IBaseCommand {
  /* 创建的文件类型 */
  fileType: string
  /* 创建的文件路径 */
  filetPath: string
}

class Touch {
  touchConfig = {
    vue: 'vue',
    taro: 'taro',
    ts: 'ts'
  };
  constructor (cmdOptions: Command) {
    console.log(cmdOptions);
  }

  public init() {

  }

  public async exec() {

  }
}

export default function (props) {
  // tslint:disable-next-line:no-unused-expression
  new Touch(props);
}

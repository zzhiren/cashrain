import Init, { IInitCommand, IVueProject } from '@models/init';
import log from '@utils/log';
import { isValidName } from '@utils/common';
import { VueTemplate } from '@constant';

class Vue extends Init<IVueProject>{
  projectInfo: IVueProject = {
    projectName: '',
    projectVersion: '',
    description: ''
  };
  constructor (cmdOptions: IInitCommand) {
    super(cmdOptions, VueTemplate);
  }

  public init() {
    if (isValidName(this.command.projectName)) {
      this.projectInfo.projectName = this.command.projectName;
    } else {
      log.error(`项目名称: '${this.command.projectName}' 不合法！`);
    }
    log.verbose('this.projectInfo', this.projectInfo);
  }

  public async exec() {
    await super.exec();
  }

  public async getProjectCustomInfo() {
    return {
      ...this.projectBaseInfo
    };
  }
}

export default function (props) {
  // tslint:disable-next-line:no-unused-expression
  new Vue(props);
}

import Command from '@models/command';
import log from '@utils/log';
class Init extends Command{
  cmdOptions;
  constructor (cmdOptions) {
    super(cmdOptions);
    this.cmdOptions = cmdOptions;
  }

  public init() {
    log.verbose('init run');
  }
}

export default function (argv) {
  new Init(argv).init();
}
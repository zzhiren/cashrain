import Command from '@models/command';

class H5 extends Command{
  constructor (cmdOptions) {
    super(cmdOptions);
  }

  public init() {}

  public exec () {
  }
}

export default function (argv) {
  new H5(argv).init();
}

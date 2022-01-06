export class GetCommandOptions {
  private static commandMap = {
    init: 'init',
    taro: 'init',
    vue: 'init',
    touch: 'touch'
  };

  static getArgv(cmdArgv) {
    const args: any[] = Array.from(cmdArgv);
    const cmd = args[args.length - 1] as object;
    const obj = Object.create(null);
    Object.keys(cmd).forEach(key => {
      if (
        cmd.hasOwnProperty(key) &&
        !key.startsWith('_') &&
        key !== 'parent'
      ) {
        obj[key] = cmd[key];
      }
    });
    args[args.length - 1] = obj;
    args.pop();
    return args;
  }

  static getOptions(cmdArgv) {
    const cmdName = cmdArgv[cmdArgv.length - 1].name();
    return GetCommandOptions[this.commandMap[cmdName]](cmdArgv);
  }

  static init(cmdArgv): NInit.Command {
    const args = GetCommandOptions.getArgv(cmdArgv);
    return {
      name: cmdArgv[cmdArgv.length - 1].name(),
      projectName: args.slice(0, args.length - 1)[0],
      options: args[args.length - 1]
    };
  }

  static touch(cmdArgv) {
    const args = GetCommandOptions.getArgv(cmdArgv);
    return {
      name: cmdArgv[cmdArgv.length - 1].name(),
      fileType: args.slice(0, args.length - 1)[0],
      filePath: args.slice(0, args.length - 1)[1],
      options: args[args.length - 1]
    };
  }
}
export class GetCommandOptions {
  private static commandMap = {
    taro: 'init',
    vue: 'init'
  };
  static getOptions(cmdArgv) {
    const cmdName = cmdArgv[cmdArgv.length - 1].name();
    return GetCommandOptions[this.commandMap[cmdName]](cmdArgv);
  }

  static init(cmdArgv): NInit.Command {
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
    return {
      name: cmdArgv[cmdArgv.length - 1].name(),
      projectName: args.slice(0, args.length - 1)[0],
      options: args[args.length - 1]
    };
  }
}
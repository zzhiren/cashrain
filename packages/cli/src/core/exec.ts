export default class Exec {
  cmdOptions: string[] = [];
  public run() {
    this.cmdOptions = arguments[arguments.length - 1];
    console.log(this.cmdOptions);
  }
}
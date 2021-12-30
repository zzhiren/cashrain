declare namespace NPackage {
  interface Options {
    targetPath: string
    storeDir: string
    packageName: string
    packageVersion: string
  }

  class Package {
    targetPath: string;
    storeDir: string;
    packageName: string;
    packageVersion: string;

    constructor (options: NPackage.Options) {}
  }
}

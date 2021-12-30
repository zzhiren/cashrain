const path = require('path');
const npmInstall = require('npminstall');
import * as fse from 'fs-extra';
import { isObject } from '@utils/common';
import { getNpmLatestVersion, getDefaultRegistry } from '@utils/npm';

export default class Package {
  targetPath: string = '';
  storeDir: string = '';
  packageName: string = '';
  packageVersion: string = '';
  cacheFilePathPrefix: string = '';

  constructor (options: NPackage.Package) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参数必须为对象！');
    }
    // package的目标路径
    this.targetPath = options.targetPath;
    // 缓存package的路径
    this.storeDir = options.storeDir;
    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
    // package的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  get cacheFilePath() {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
  }

  public async prepare() {
    if (this.storeDir && !fse.pathExistsSync(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
  }

  public async exists() {
    if (this.storeDir) {
      await this.prepare();
      return fse.pathExistsSync(this.cacheFilePath);
    } else {
      return fse.pathExistsSync(this.targetPath);
    }
  }

  // 安装Package
  public async install() {
    await this.prepare();
    return npmInstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{
        name: this.packageName,
        version: this.packageVersion
      }]
    });
  }

  public async update() {
    // 1.获取最新的npm模块版本
    const latestPackageVersion = await getNpmLatestVersion(this.packageName);
    // 2.查询最新版本号对应的缓存路径是否存在
    const latestPackageStorePath = this.getSpecificCacheFilePath(latestPackageVersion);

    // 3.如果不存在直接安装最新版本
    if (!fse.pathExistsSync(latestPackageStorePath)) {
      await npmInstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [{
          name: this.packageName,
          version: latestPackageVersion
        }]
      });
      this.packageVersion = latestPackageVersion;
    } else {
      this.packageVersion = latestPackageVersion;
    }
  }

  public getSpecificCacheFilePath(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
  }
}
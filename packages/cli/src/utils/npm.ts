'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

export function getNpmInfo(npmName: string, registry: string) {
  if (!npmName) {
    return null;
  }

  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }

      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getDefaultRegistry(isOriginal: boolean = true) {
  return isOriginal ? 'https://registry.npmjs.org' : 'http://10.241.65.86:8081';
}

export async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

export async function getNpmLatestVersion(npmName: string, registry?: string) {
  const versions = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort((a, b) => semver.gt(b, a))[0];
  }

  return null;
}

export function getSemverVersions(baseVersion: string, versions: string[]) {
  return versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(b, a));
}

export async function getNpmSemverVersions(baseVersion: string, npmName: string, registry?: string): Promise<string> {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  } else {
    return ''
  }
}

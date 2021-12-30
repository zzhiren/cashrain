'use strict';

export function isObject (o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function spinnerStart (msg, spinnerString: string = '|/-\\') {
  const Spinner = require('cli-spinner').Spinner;
  const spinner = new Spinner(msg + '%s');
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
}

export function sleep (timeout: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function exec(command, args, options) {
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

export function execAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const p = exec(command, args, options);
    p.on('error', e => {
      reject(e);
    });
    p.on('exit', c => {
      resolve(c);
    });
  });
}


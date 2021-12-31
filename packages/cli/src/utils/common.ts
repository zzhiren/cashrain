'use strict';

import fs from 'fs';

export function isObject(o: unknown) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function dirIsEmpty(localPath: string): boolean {
  let fileList: string[] = fs.readdirSync(localPath);
  fileList = fileList.filter(
    (file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
  );

  return !fileList || fileList.length <= 0;
}

export function isValidName(v: string): boolean {
  return /^[a-zA-Z]+(([-]|[_])[a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
}

export function formatDate(format: string) {
  const date = new Date();
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substring(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length)
      );
    }
  }
  return format;
}


export function spinnerStart(msg, spinnerString = '|/-\\') {
  const Spinner = require('cli-spinner').Spinner;
  const spinner = new Spinner(msg + ' %s');
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
}

export function sleep(timeout = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function oraSpinner(msg: string) {
  const ora = require('ora')(msg);
  ora.start();
  return ora;
}
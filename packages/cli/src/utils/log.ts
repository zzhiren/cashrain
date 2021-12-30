'use strict';

const log = require('npmlog');
import { HEADING } from '@constant';

/** 判断debug模式 */
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

/** 修改前缀 */
log.heading = HEADING;

/** 添加自定义命令 */
log.addLevel('success', 2000, { fg: 'green', bold: true });
log.addLevel('welcome', 2000, { fg: 'red', bold: true });
log.addLevel('version', 2000, { fg: 'blue', bold: true });

export default log;

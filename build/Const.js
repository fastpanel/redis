"use strict";
/**
 * Const.ts
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default redis config.
 */
exports.REDIS_CONFIG = {
    host: '127.0.0.1',
    port: 6379,
    options: {
        family: 4,
        password: '',
        db: 0,
        keyPrefix: 'fastpanel:'
    }
};
/* End of file Const.ts */ 

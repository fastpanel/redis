/**
 * Const.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

/**
 * Default redis config.
 */
export const REDIS_CONFIG = {
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
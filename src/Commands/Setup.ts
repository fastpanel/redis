/**
 * Setup.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import { EOL } from 'os';
import Winston from 'winston';
import { Cli } from '@fastpanel/core';
import { REDIS_CONFIG } from './../Const';

/**
 * Class Setup
 * 
 * @version 1.0.0
 */
export class Setup extends Cli.CommandDefines {
  
  /**
   * Initialize a commands provider.
   */
  public initialize () {
    this.cli
    .command('fastpanel/redis setup', 'Configure redis components.')
    .option('-e, --env', 'Save as current environment settings.')
    .option('-f, --force', 'Forced command running.')
    .visible(false)
    .action((args: {[k: string]: any}, options: {[k: string]: any}, logger: Winston.Logger) => {
      return new Promise(async (resolve, reject) => {
        /* Info message. */
        logger.info(`${EOL}Configure redis components.`);

        if (!this.config.get('Ext/Redis', false) || options.force) {
          
        } else {
          /* Info message. */
          logger.info(` Everything is already configured. ${EOL}`);
        }

        /* Command complete. */
        resolve();
      });
    });
  }

}

/* End of file Setup.js */
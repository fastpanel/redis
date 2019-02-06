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
import { join, merge } from 'lodash';
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
    .option('-f, --force', 'Forced reconfiguration of components.')
    .visible(false)
    .action((args: {[k: string]: any}, options: {[k: string]: any}, logger: Winston.Logger) => {
      return new Promise(async (resolve, reject) => {
        /* Info message. */
        logger.info(`${EOL}Configure redis components.`);

        if (!this.config.get('Ext/Redis', false) || options.force) {
          /* Prompts list. */
          let queCommon = [
            /* Connection type. */
            {
              type: 'list',
              name: 'type',
              message: 'Select the type of connection to the "redis" server?',
              choices: ['default', 'cluster'],
              default: this.config.get('Ext/Redis.type', REDIS_CONFIG.type)
            },
            /* Default host. */
            {
              type: 'input',
              name: 'host',
              message: 'Enter the address of the "redis" server.',
              default: this.config.get('Ext/Redis.host', REDIS_CONFIG.host),
              when (answers: any) {
                return (answers.type == 'default');
              }
            },
            /* Default port. */
            {
              type: 'input',
              name: 'port',
              message: 'Enter the port of the "redis" server.',
              default: this.config.get('Ext/Redis.port', REDIS_CONFIG.port),
              when (answers: any) {
                return (answers.type == 'default');
              }
            },
            /* Cluster hosts. */
            {
              type: 'input',
              name: 'hosts',
              message: 'Enter the address and port of the redis cluster separated by a semicolon.',
              default: join(this.config.get('Ext/Redis.hosts', ['127.0.0.1:6379']), ';'),
              when (answers: any) {
                return (answers.type == 'cluster');
              },
              filter (val: string) {
                let hosts = [];
                let hostsTmp = val.split(';');

                /* Get hosts list. */
                for (const item of hostsTmp) {
                  let tmp = item.split(':');
                  if (tmp.length == 2) {
                    hosts.push({
                      host: tmp[0],
                      port: tmp[1]
                    });
                  }
                }

                return hosts;
              }
            }
          ];

          /* Show prompts to user. */
          let config = await this.prompt(queCommon);
          config.options = {};

          /* Prompts list. */
          let queOptions = [
            /* Ip family. */
            {
              type: 'input',
              name: 'family',
              message: 'Redis ip family 4 or 6?',
              default: this.config.get('Ext/Redis.options.family', REDIS_CONFIG.options.family)
            },
            /* Password. */
            {
              type: 'input',
              name: 'password',
              message: 'Redis connection password?',
              default: this.config.get('Ext/Redis.options.password', REDIS_CONFIG.options.password)
            },
            /* DB index. */
            {
              type: 'input',
              name: 'db',
              message: 'Redis db index?',
              default: this.config.get('Ext/Redis.options.db', REDIS_CONFIG.options.db)
            },
            /* Key prefix. */
            {
              type: 'input',
              name: 'keyPrefix',
              message: 'Redis key prefix?',
              default: this.config.get('Ext/Redis.options.keyPrefix', REDIS_CONFIG.options.keyPrefix)
            }
          ];

          /* Show prompts to user. */
          config.options = await this.prompt(queOptions);

          /* Save data. */
          this.config.set('Ext/Redis', config);
          this.config.save('Ext/Redis', !(options.env));

          /* Info message. */
          logger.info(`${EOL}Applied:`);
          logger.info('', this.config.get('Ext/Redis'));
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
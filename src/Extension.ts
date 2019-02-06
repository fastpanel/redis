/**
 * Extension.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import Redis from 'ioredis';
import Caporal from 'caporal';
import { REDIS_CONFIG } from './Const';
import { Di, Extensions } from '@fastpanel/core';

/**
 * Class Extension
 * 
 * Initialization of the extension.
 * 
 * @version 1.0.0
 */
export class Extension extends Extensions.ExtensionDefines {

  /**
   * Registers a service provider.
   */
  async register () : Promise<any> {
    /* Registered redis component. */
    this.di.set('redis', (di: Di.Container, params: any) => {
      let config: any = di
        .get('config')
        .get('Ext/Redis', REDIS_CONFIG);

      if (typeof params.type !== 'undefined') {
        config = params;
      } else if (typeof process.env.REDIS_TYPE !== 'undefined') {
        switch (process.env.REDIS_TYPE) {
          case 'cluster':
            let hosts = [];
            let hostsTmp = process.env.REDIS_HOSTS.split(';');

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

            /* Set params for "cluster" type. */
            config = {
              type: 'cluster',
              hosts: hosts,
              options: {}
            };
          break;
          default:
            /* Set params for "default" type. */
            config = {
              type: 'default',
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
              options: {}
            };
          break;
        }

        /* Set common params. */
        config.options = {
          family: (process.env.REDIS_OPTIONS_FAMILY)
            ? process.env.REDIS_OPTIONS_FAMILY
            : di.get('config')
            .get('Ext/Redis.options.family', REDIS_CONFIG.options.family),
          password: (process.env.REDIS_OPTIONS_PASSWORD)
            ? process.env.REDIS_OPTIONS_PASSWORD
            : di.get('config')
            .get('Ext/Redis.options.password', REDIS_CONFIG.options.password),
          db: (process.env.REDIS_OPTIONS_DB)
            ? process.env.REDIS_OPTIONS_DB
            : di.get('config')
            .get('Ext/Redis.options.db', REDIS_CONFIG.options.db),
          keyPrefix: (process.env.REDIS_OPTIONS_KEY_PREFIX)
            ? process.env.REDIS_OPTIONS_KEY_PREFIX
            : di.get('config')
            .get('Ext/Redis.options.keyPrefix', REDIS_CONFIG.options.keyPrefix)
        }
      }

      switch (config.type) {
        case 'cluster':
          return new Redis.Cluster(
            config.hosts,
            { redisOptions: config.options }
          );
        default:
          return new Redis(
            config.port,
            config.host,
            config.options
          );
      }
    }, false);
    
    /* --------------------------------------------------------------------- */
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', (cli: Caporal) => {
      const { Setup } = require('./Commands/Setup');
      (new Setup(this.di)).initialize();
    });
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {}

}

/* End of file Extension.ts */
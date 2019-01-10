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
import { Cli, Di, Extensions } from '@fastpanel/core';

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

      if (
        typeof params.host !== 'undefined' || 
        typeof params.hosts !== 'undefined'
      ) {
        config = params;
      }

      if (typeof config.host !== 'undefined') {
        return new Redis(
          (config.port) ? config.port : REDIS_CONFIG.port,
          (config.host) ? config.host : REDIS_CONFIG.host,
          (config.options) ? config.options : REDIS_CONFIG.options
        );
      } else if (typeof config.hosts !== 'undefined') {
        return new Redis.Cluster(
          config.hosts,
          { redisOptions: config.options }
        );
      } else {
        return new Redis(
          REDIS_CONFIG.port,
          REDIS_CONFIG.host,
          REDIS_CONFIG.options
        );
      }
    }, false);
    
    /* --------------------------------------------------------------------- */
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', async (cli: Caporal) => {
      const { Setup } = require('./Commands/Setup');
      await (new Setup(this.di)).initialize();
    });
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {}

}

/* End of file Extension.ts */
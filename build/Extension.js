"use strict";
/**
 * Extension.ts
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const Const_1 = require("./Const");
const core_1 = require("@fastpanel/core");
/**
 * Class Extension
 *
 * Initialization of the extension.
 *
 * @version 1.0.0
 */
class Extension extends core_1.Extensions.ExtensionDefines {
    /**
     * Registers a service provider.
     */
    async register() {
        /* Check config. */
        if (this.config.get('Ext/Redis', false) ||
            this.config.get('Env.REDIS_TYPE', false)) {
            /* Registered redis component. */
            this.di.set('redis', (di, params) => {
                let config = this.config
                    .get('Ext/Redis', Const_1.REDIS_CONFIG);
                if (typeof params.type !== 'undefined') {
                    config = params;
                }
                else if (this.config.get('Env.REDIS_TYPE', false)) {
                    switch (this.config.get('Env.REDIS_TYPE')) {
                        case 'cluster':
                            let hosts = [];
                            let hostsTmp = this.config.get('Env.REDIS_HOSTS', '').split(';');
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
                                host: this.config.get('Env.REDIS_HOST'),
                                port: this.config.get('Env.REDIS_PORT'),
                                options: {}
                            };
                            break;
                    }
                    /* Set common params. */
                    config.options = {
                        family: this.config.get('Env.REDIS_OPTIONS_FAMILY', this.config.get('Ext/Redis.options.family', Const_1.REDIS_CONFIG.options.family)),
                        password: this.config.get('Env.REDIS_OPTIONS_PASSWORD', this.config.get('Ext/Redis.options.password', Const_1.REDIS_CONFIG.options.password)),
                        db: this.config.get('Env.REDIS_OPTIONS_DB', this.config.get('Ext/Redis.options.db', Const_1.REDIS_CONFIG.options.db)),
                        keyPrefix: this.config.get('Env.REDIS_OPTIONS_KEY_PREFIX', this.config.get('Ext/Redis.options.keyPrefix', Const_1.REDIS_CONFIG.options.keyPrefix))
                    };
                }
                switch (config.type) {
                    case 'cluster':
                        return new ioredis_1.default.Cluster(config.hosts, { redisOptions: config.options });
                    default:
                        return new ioredis_1.default(config.port, config.host, config.options);
                }
            }, false);
        }
        else {
            this.logger.warn('Component "Redis" is not configured correctly!');
        }
        /* --------------------------------------------------------------------- */
        /* Registered cli commands. */
        this.events.once('cli:getCommands', (cli) => {
            /* Add setup command. */
            const { Setup } = require('./Commands/Setup');
            (new Setup(this.di)).initialize();
        });
    }
    /**
     * Startup a service provider.
     */
    async startup() { }
}
exports.Extension = Extension;
/* End of file Extension.ts */ 

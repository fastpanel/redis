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
        /* Registered redis component. */
        this.di.set('redis', (di, params) => {
            let config = di
                .get('config')
                .get('Extensions/Redis', Const_1.REDIS_CONFIG);
            if (typeof params.host !== 'undefined' ||
                typeof params.hosts !== 'undefined') {
                config = params;
            }
            if (typeof config.host !== 'undefined') {
                return new ioredis_1.default((config.port) ? config.port : Const_1.REDIS_CONFIG.port, (config.host) ? config.host : Const_1.REDIS_CONFIG.host, (config.options) ? config.options : Const_1.REDIS_CONFIG.options);
            }
            else if (typeof config.hosts !== 'undefined') {
                return new ioredis_1.default.Cluster(config.hosts, { redisOptions: config.options });
            }
            else {
                return new ioredis_1.default(Const_1.REDIS_CONFIG.port, Const_1.REDIS_CONFIG.host, Const_1.REDIS_CONFIG.options);
            }
        }, false);
        /* --------------------------------------------------------------------- */
        /* Registered cli commands. */
        this.events.once('cli:getCommands', async (cli) => { });
        /* Install and configure the basic components of the system. */
        this.events.on('app:getSetupSubscriptions', (list) => {
            list.push(async (command, args) => {
                /* Check and create default config file. */
                if (!this.config.get('Extensions/Redis', false)) {
                    this.config.set('Extensions/Redis', Const_1.REDIS_CONFIG);
                    this.config.save('Extensions/Redis', true);
                }
            });
        });
    }
    /**
     * Startup a service provider.
     */
    async startup() { }
}
exports.Extension = Extension;
/* End of file Extension.ts */ 

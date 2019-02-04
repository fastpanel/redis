"use strict";
/**
 * Setup.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const core_1 = require("@fastpanel/core");
const lodash_1 = require("lodash");
const Const_1 = require("./../Const");
/**
 * Class Setup
 *
 * @version 1.0.0
 */
class Setup extends core_1.Cli.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    initialize() {
        this.cli
            .command('fastpanel/redis setup', 'Configure redis components.')
            .option('-e, --env', 'Save as current environment settings.')
            .option('-f, --force', 'Forced reconfiguration of components.')
            .visible(false)
            .action((args, options, logger) => {
            return new Promise(async (resolve, reject) => {
                /* Info message. */
                logger.info(`${os_1.EOL}Configure redis components.`);
                if (!this.config.get('Ext/Redis', false) || options.force) {
                    /* Prompts list. */
                    let questions = [
                        /* Redis connection type. */
                        {
                            type: 'list',
                            name: 'type',
                            message: 'Select the type of connection to the "redis" server?',
                            choices: ['default', 'cluster'],
                            default: this.config.get('Ext/Redis.type', Const_1.REDIS_CONFIG.type)
                        },
                        /* Default host. */
                        {
                            type: 'input',
                            name: 'host',
                            message: 'Enter the address of the "redis" server.',
                            default: this.config.get('Ext/Redis.host', Const_1.REDIS_CONFIG.host),
                            when(answers) {
                                return (answers.type == 'default');
                            }
                        },
                        /* Default port. */
                        {
                            type: 'input',
                            name: 'port',
                            message: 'Enter the port of the "redis" server.',
                            default: this.config.get('Ext/Redis.port', Const_1.REDIS_CONFIG.port),
                            when(answers) {
                                return (answers.type == 'default');
                            }
                        },
                        /* Cluster hosts. */
                        {
                            type: 'input',
                            name: 'hosts',
                            message: 'Enter the address and port of the redis cluster separated by a semicolon.',
                            default: lodash_1.join(this.config.get('Ext/Redis.hosts', ['127.0.0.1:6379']), ';'),
                            when(answers) {
                                return (answers.type == 'cluster');
                            },
                            filter(val) {
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
                    let config = await this.prompt(questions);
                    config.options = {};
                    /* Prompts list. */
                    questions = [];
                    /* Show prompts to user. */
                    config.options = await this.prompt(questions);
                    /* Save data. */
                    this.config.set('Ext/Redis', config);
                    this.config.save('Ext/Redis', !(options.env));
                    /* Info message. */
                    logger.info(`${os_1.EOL}Applied:`);
                    logger.info('', this.config.get('Ext/Redis'));
                }
                else {
                    /* Info message. */
                    logger.info(` Everything is already configured. ${os_1.EOL}`);
                }
                /* Command complete. */
                resolve();
            });
        });
    }
}
exports.Setup = Setup;
/* End of file Setup.js */ 

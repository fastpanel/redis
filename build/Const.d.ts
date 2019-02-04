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
export declare const REDIS_CONFIG: {
    type: string;
    host: string;
    port: number;
    options: {
        family: number;
        password: string;
        db: number;
        keyPrefix: string;
    };
};

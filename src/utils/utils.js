'use strict';

let path = require('path'),
    logging = require('./logging');

require('colors');

let Utils = module.exports;

Utils.errorHandler = null;

Utils.getProjectDirectory = function getProjectDirectory(options) {
    return path.resolve(options.appDirectory);
};

Utils.fail = function fail(msg, taskHelp) {
    try {
        logging.logger.debug('Utils.fail', msg, taskHelp);
        logging.logger.debug('Utils.fail stack', msg.stack);

        //If an error handler is set, use it. Otherwise, just print basic info.
        if (Utils.errorHandler) {
            logging.logger.debug('Utils.errorHandler is set, calling that now');
            return Utils.errorHandler(msg, taskHelp);
        }

        logging.logger.error('An error occurred in App Lib and no error handler was set.');
        logging.logger.error(msg);
        process.exit(1);
        return '';
    } catch (ex) {
        logging.logger.debug('Utils.fail: ', ex);
    }
};
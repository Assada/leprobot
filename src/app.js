'use strict';

const App = module.exports,
    TelegramBot = require('node-telegram-bot-api'),
    optimist = require('optimist'),
    Info = cb_require('utils/info'),
    settings = require(__basedir + '/package.json'),
    Random = require("random-js");

let Router = cb_require('router');

App.utils = cb_require('utils/utils');
App.logging = cb_require('utils/logging');

App.run = function run(processArgv, processCwd) {
    require('dotenv').load({silent: true});
    this.cwd = processCwd || process.cwd();

    try {
        let argv = optimist(processArgv.slice(2)).argv;

        this.logging.setUpConsoleLoggingHelpers();
        App.attachErrorHandling();

        if (process.env.NODE_ENV !== 'test') {
            process.once('exit', function () {
                App.printVersionWarning();
            });
        }

        if ((argv.version || argv.v) && (!argv._.length)) {
            return App.version();
        }

        if (argv.verbose) {
            this.logging.logger.level = 'debug';
        }

        //GlobalDeps
        const randomizer = new Random(Random.engines.mt19937().autoSeed()),
            bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

        const R = new Router(bot, this.logging, randomizer);
        R.handle();
    } catch (ex) {
        this.logging.logger.debug('Cli.Run - Error', ex);
        return this.utils.fail(ex);
    }
};

App.printVersionWarning = function printVersionWarning() {
    if (App.npmVersion && App.npmVersion !== settings.version.trim()) {
        process.stdout.write('\n------------------------------------\n'.red);
        process.stdout.write('App is out of date:\n'.bold.yellow);
        process.stdout.write((' * Locally installed version: ' + settings.version + '\n').yellow);
        process.stdout.write((' * Latest version: ' + App.npmVersion + '\n').yellow);
        process.stdout.write((' * https://github.com/Assada/leprobot/blob/master/CHANGELOG.md\n').yellow);
        process.stdout.write(' * Run '.yellow + 'npm install -g leprobot'.bold + ' to update\n'.yellow);
        process.stdout.write('------------------------------------\n\n'.red);
        App.npmVersion = null;
    }
};

App.version = function version() {
    console.log(settings.version + '\n');
};

App.handleUncaughtExceptions = function handleUncaughtExceptions(err) {
    console.log('An uncaught exception occurred.'.error.bold);
    let errorMessage = typeof err === 'string' ? err : err.message;
    this.utils.errorHandler(errorMessage);
    process.exit(1);
};

App.gatherInfo = function gatherInfo() {
    let info = Info.gatherInfo();
    Info.getAppVersion(info, process.cwd());

    return info;
};

App.attachErrorHandling = function attachErrorHandling() {
    this.utils.errorHandler = function errorHandler(msg) {
        try {
            app.logging.logger.debug('cli.utils.errorHandler msg', msg, typeof msg);

            let stack = typeof msg == 'string' ? '' : msg.stack;
            let errorMessage = typeof msg == 'string' ? msg : msg.message;
            // console.log('stack', stack, arguments.caller);
            if (msg) {
                let info = App.gatherInfo();
                let appVersion = info.app_version;
                process.stderr.write('\n' + stack.error.bold + '\n\n');
                process.stderr.write(errorMessage.error.bold);
                process.stderr.write((' (App v' + appVersion + ')').error.bold + '\n');

                Info.printInfo(info);
            }
            process.stderr.write('\n');
            process.exit(1);
            return '';
        } catch (ex) {
            console.log('errorHandler had an error', ex);
            console.log(ex.stack);
        }
    };
};

App.fail = function fail(err, taskHelp) {
    // var error = typeof err == 'string' ? new Error(err) : err;
    this.utils.fail(err, taskHelp);
};

App.require = function (name) {
    if ((name.substring(0, 1) === '/') ||
        (name.substring(0, 2) === './') ||
        (name.substring(0, 3) === '../')) {
        return require(path.join(__basedir, name));
    }

    return require(name);
};

App.cb_require = cb_require;
'use strict';

const path = require('path'),
    shelljs = require('shelljs'),
    os = require('os'),
    semver = require('semver'),
    logging = require('./logging');

let Info = module.exports;

const requirements = {
    node: '>=6.0.0'
};

Info.getAppVersion = function getAppVersion(info) {
    try {
        let packagePath = path.join(__basedir, 'package.json');
        let packageJson = require(packagePath);

        info.app_version = packageJson.version;
    } catch (ex) {
    }
};

// Windows XP  5.1.2600
// Windows Server 2003 5.2.3790
// Windows Vista
// Windows Server 2008 6.0.6000
// Windows Vista, SP2  6.0.6002
// Windows 7
// Windows Server 2008 R2  6.1.7600
// Windows 7 SP1
// Windows Server 2008 R2 SP1  6.1.7601
// Windows 8
// Windows Server 2012 6.2.9200
// Windows 8.1
// Windows Server 2012 R2  6.3.9600
// Windows 10 Technical Preview  6.4.9841

Info.getWindowsEnvironmentInfo = function getWindowsEnvironmentInfo() {
    // Windows version reference
    // http://en.wikipedia.org/wiki/Ver_%28command%29
    let version = os.release();
    let windowsVersion = null;
    switch (version) {
        case '5.1.2600':
            windowsVersion = 'Windows XP';
            break;
        case '6.0.6000':
            windowsVersion = 'Windows Vista';
            break;
        case '6.0.6002':
            windowsVersion = 'Windows Vista SP2';
            break;
        case '6.1.7600':
            windowsVersion = 'Windows 7';
            break;
        case '6.1.7601':
            windowsVersion = 'Windows 7 SP1';
            break;
        case '6.2.9200':
            windowsVersion = 'Windows 8';
            break;
        case '6.3.9600':
            windowsVersion = 'Windows 8.1';
            break;
        default:
            if (version.substring(0, 4) === '10.0') {
                windowsVersion = 'Windows 10';
                break;
            }
    }

    return windowsVersion;
};

Info.getLinuxEnvironmentInfo = function getLinuxEnvironmentInfo() {
    let result = shelljs.exec('lsb_release -id', {silent: true});
    return result.stdout.replace(/\n/g, ' ');
};

//http://stackoverflow.com/questions/6551006/get-my-os-from-the-node-js-shell
Info.getOsEnvironment = function getOsEnvironment(info) {
    switch (process.platform) {
        case 'darwin':
            info.os = 'darwin'; //TODO: Implement mac version
            break;
        case 'win32':
            info.os = Info.getWindowsEnvironmentInfo();
            break;
        case 'linux':
            info.os = Info.getLinuxEnvironmentInfo();
            break;
    }
};

Info.getNodeVersion = function getNodeVersion(info) {
    info.node = process.version;

    if (info.node[0] === 'v')
        info.node = info.node.substring(1);
};
Info.gatherInfo = function gatherInfo() {
    var info = {};

    Info.getNodeVersion(info);

    Info.getOsEnvironment(info);

    return info;
};

Info.printInfo = function printInfo(info) {
    logging.logger.info('\nYour system information:\n'.bold);

    if (info.app_version) {
        logging.logger.info('AppVersion:', info.app_info);
    }

    logging.logger.info('OS:', info.os);
    logging.logger.info('Node Version:', info.node);

    logging.logger.info('\n');
};

Info.checkRuntime = function checkRuntime() {
    var info = this.gatherInfo(),
        iosDeployInstalled = false,
        iosSimInstalled = false,
        nodeUpgrade = false,
        validRuntime = true;

    try {
        nodeUpgrade = !semver.satisfies(info.node, requirements.node);
    } catch (ex) {
    }

    logging.logger.debug('System Info:', info);

    let checkOsx = process.platform === 'darwin';

    let checkOsxDeps = checkOsx && (!iosSimInstalled || !iosDeployInstalled);

    // console.log('nodeUpgrade', nodeUpgrade);
    let showDepdencyWarning = nodeUpgrade || checkOsxDeps;

    if (showDepdencyWarning) {
        logging.logger.info('******************************************************'.red.bold);
        logging.logger.info(' Dependency warning - for the CLI to run correctly,	  '.red.bold);
        logging.logger.info(' it is highly recommended to install/upgrade the following:	 '.red.bold);
        logging.logger.info('');

        if (nodeUpgrade) {
            var updateMessage = [' Please update your Node runtime to version ', requirements.node].join(' ');
            logging.logger.info(updateMessage.red.bold);
            validRuntime = false;
        }

        logging.logger.info('');
        logging.logger.info('******************************************************'.red.bold);
    }

    return validRuntime;
};

Info.run = function run() {
    let info = Info.gatherInfo();
    Info.printInfo(info);

    Info.checkRuntime();

};
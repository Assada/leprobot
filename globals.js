'use strict';

global.__basedir = __dirname;
global.cb_require = function cb_require(moduleName) {
    try {
        const modulePath = __basedir + '/src/' + moduleName;
        console.debug("[DEBUG] (globals) require module: " + moduleName);
        return require(modulePath);
    } catch (e) {
        console.debug("[DEBUG] (globals)", e);
        console.error("[ERROR] (globals)", e.code, moduleName);
    }
};

global.app = cb_require('app');

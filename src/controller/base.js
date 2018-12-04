"use strict";

class BaseController {
    /**
     * @param {TelegramBot} bot
     * @param {Logging} logging
     */
    constructor(bot, logging) {
        this.bot = bot;
        this.logging = logging;
    }

    getLogger() {
        return this.logging;
    }
}

module.exports = BaseController;
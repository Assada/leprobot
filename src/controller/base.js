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
}

module.exports = BaseController;
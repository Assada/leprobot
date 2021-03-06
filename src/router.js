'use strict';

const MessageController = cb_require('controller/message'); //OK
const CatController = cb_require('controller/cat'); //OK
const WeatherController = cb_require('controller/weather'); //OK
const RateController = cb_require('controller/rate'); //OK
const BoobsController = cb_require('controller/boobs'); //OK
const ButtController = cb_require('controller/butt'); // ERROR
const PussyController = cb_require('controller/pussy'); //ERROR

class Router {
    /**
     * @param {TelegramBot} bot
     * @param {Logging} logger
     * @param {Random} randomizer
     */
    constructor(bot, logger, randomizer) {
        this.bot = bot;
        this.logger = logger;
        this.randomizer = randomizer;
    }

    handle() {
        /**
         * @param {Object} msg
         */
        this.bot.on('message', (msg) => {
            const controller = new MessageController(this.bot, this.logger);
            controller.process(msg);
        });

        this.bot.onText(/^\/cat(?:\@.*?)?$/, (msg) => {
            const controller = new CatController(this.bot, this.logger, this.randomizer);
            controller.process(msg);
        });

        this.bot.onText(/^\/weather(?:\@.*?)?$/, (msg) => {
            const controller = new WeatherController(this.bot, this.logger);
            controller.process(msg);
        });

        this.bot.onText(/^\/rate(?:\@.*?)?$/, (msg) => {
            const controller = new RateController(this.bot, this.logger);
            controller.process(msg);
        });

        this.bot.onText(/^\/boobs(?:\@.*?)?$/, (msg) => {
            const controller = new BoobsController(this.bot, this.logger);
            controller.process(msg);
        });

        this.bot.onText(/^\/pussy(?:\@.*?)?$/, (msg) => {
            const controller = new PussyController(this.bot, this.logger, this.randomizer);
            controller.process(msg);
        });

        this.bot.onText(/^\/butt(?:\@.*?)?$/, (msg) => {
            const controller = new ButtController(this.bot, this.logger);
            controller.process(msg);
        });
    }
}

module.exports = Router;

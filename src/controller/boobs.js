"use strict";

const request = require('request');
const BaseController = cb_require('controller/base');

class BoobsController extends BaseController {
    /**
     * @param {TelegramBot} bot
     * @param {Logging} logging
     * @param {Random} randomizer
     */
    constructor(bot, logging, randomizer) {
        super(bot, logging);
    }

    /**
     * @param {Object} msg
     */
    process(msg) {
        const chat = msg.chat.id;
        const from = msg.from;
        const t = this;

        console.debug('Received command \\boobs in ' + chat + ' from ' + from.username + '(' + from.id + ')');

        const options = {
            reply_to_message_id: msg.message_id
        };

        try {
            t.bot.sendChatAction(chat, 'upload_photo');
            request.get('http://api.oboobs.ru/boobs/0/1/random', function (err, response, body) {
                let json = JSON.parse(body);
                let photoLink = 'http://media.oboobs.ru/' + json[0].preview;
                let photo = request(photoLink);
                options.caption = json[0].model;
                t.bot.sendPhoto(chat, photo, options);
            });
        } catch (e) {
            this.logging.logger.error('[ERROR] (boobs)', e);
        }

    }
}

module.exports = BoobsController;
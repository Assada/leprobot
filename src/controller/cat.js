"use strict";

const request = require('request'),
    BaseController = cb_require('controller/base');

class Cat extends BaseController {
    /**
     * @param {TelegramBot} bot
     * @param {Logging} logging
     * @param {Random} randomizer
     */
    constructor(bot, logging, randomizer) {
        super(bot, logging);
        this.randomizer = randomizer;
        this.labels = [
            'Вот тебе котя!',
            'Держи котю',
            'Котя - топчик',
            'СМОТРИ КАКОЙ ЗАБАВНЫЙ!',
            'Всем котю!',
            ':3',
            'Ой! Какой милаш!',
            'Котики, конечно, лучшие!'
        ];
    }

    /**
     * @param {Object} msg
     */
    process(msg) {
        const chat = msg.chat.id;
        const from = msg.from;
        const t = this;

        console.debug('Received command \\cat in ' + chat + ' from ' + from.username + '(' + from.id + ')');

        const options = {
                caption: t.randomizer.pick(t.labels),
                reply_to_message_id: msg.message_id
            },
            fileOptions = {
                filename: 'cat'
            };

        try {
            t.bot.sendChatAction(chat, 'upload_photo');
            request.get('http://thecatapi.com/api/images/get?format=src', function (err, response, body) {
                fileOptions.contentType = response.headers['content-type'];
                fileOptions.filename = this.uri.href;
                let photo = request(this.uri.href);
                console.debug(fileOptions);
                if (fileOptions.contentType === 'image/gif') {
                    t.bot.sendDocument(chat, photo, options, fileOptions)
                } else {
                    t.bot.sendPhoto(chat, photo, options, fileOptions);
                }
            });
        } catch (e) {
            this.logging.logger.error('[ERROR] (cat)', e);
        }
    }
}

module.exports = Cat;

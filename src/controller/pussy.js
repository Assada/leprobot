"use strict";

const request = require('request'),
    randomPussy = require('random-vagina'),
    BaseController = cb_require('controller/base');

class Pussy extends BaseController {
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

        console.debug('Received command \\pussy in ' + chat + ' from ' + from.username + '(' + from.id + ')');

        const options = {
                caption: t.randomizer.pick(t.labels),
                reply_to_message_id: msg.message_id
            },
            fileOptions = {
                filename: 'cat'
            };
        try {
            randomPussy()
                .then(url => {
                    request.get(url, function (err, res, body) {
                        t.bot.sendChatAction(chat, 'upload_photo');
                        fileOptions.contentType = res.headers['content-type'];
                        fileOptions.filename = this.uri.href;
                        t.getLogger().logger.info(fileOptions);
                        const photo = request(this.uri.href);
                        if (this.uri.href.indexOf('.gif') !== -1) {
                            t.bot.sendDocument(chat, photo, options, fileOptions)
                        } else {
                            t.bot.sendPhoto(chat, photo, options, fileOptions);
                        }
                    });
                })
        } catch (e) {
            this.getLogger().logging.logger.error('[ERROR] (pussy)', e);
        }
    }
}

module.exports = Pussy;

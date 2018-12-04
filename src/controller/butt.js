'use strict';

const request = require('request'),
    randomAss = require('random-butt'),
    BaseController = cb_require('controller/base');

class Butt extends BaseController {
    /**
     * @param {Object} msg
     */
    process(msg) {
        const chat = msg.chat.id;
        const from = msg.from;
        const t = this;

        console.debug('Received command \\butt in ' + chat + ' from ' + from.username + '(' + from.id + ')');

        const options = {
                caption: t.randomizer.pick(t.labels),
                reply_to_message_id: msg.message_id
            },
            fileOptions = {
                filename: 'cat'
            };
        try {
            randomAss()
                .then(url => {
                    request.get(url, function (err, res, body) {
                        // t.bot.sendChatAction(chat, 'upload_photo');
                        fileOptions.contentType = res.headers['content-type'];
                        fileOptions.filename = this.uri.href;
                        console.debug(fileOptions);
                        const photo = request(this.uri.href);
                        if (this.uri.href.indexOf('.gif') !== -1) {
                            t.bot.sendDocument(chat, photo, options, fileOptions)
                        } else {
                            t.bot.sendPhoto(chat, photo, options, fileOptions);
                        }
                    });
                })
        } catch (e) {
            this.logging.logger.error('[ERROR] (butt)', e);
        }
    }
}

module.exports = Butt;

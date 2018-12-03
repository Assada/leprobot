"use strict";

const BaseController = cb_require('controller/base');

class Message extends BaseController {
    /**
     * @param {Object} msg
     */
    process(msg) {
        const chat = msg.chat.id;
        const text = msg.text;
        const from = msg.from;

        if (typeof text !== 'undefined' && text.charAt(0) !== '/') {
            console.debug('Received message in ' + chat + ' from ' + from.username + '(' + from.id + ')');

            this.bot.sendMessage(chat, text, {
                reply_to_message_id: msg.message_id
            });
        }
    }
}

module.exports = Message;
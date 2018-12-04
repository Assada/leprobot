"use strict";

const request = require('request');
const BaseController = cb_require('controller/base');

class RateController extends BaseController {
    process(msg) {
        const chat = msg.chat.id;
        const t = this;
        t.bot.sendChatAction(chat, 'typing');

        request({
            url: 'http://resources.finance.ua/ru/public/currency-cash.json',
            json: true
        }, function (error, response, body) {
            const USD = RateController.processRate(body, 'USD');
            const EUR = RateController.processRate(body, 'EUR');
            const RUB = RateController.processRate(body, 'RUB');

            const message = 'Средние наличные курсы валют:\n' +
                '<b>USD:</b> ' + USD.bid + '/' + USD.ask + '\n' +
                '<b>EUR:</b> ' + EUR.bid + '/' + EUR.ask + '\n' +
                '<b>RUB:</b> ' + RUB.bid + '/' + RUB.ask;
            t.bot.sendMessage(chat, message, {
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
        });
    }

    /**
     * @param {array} arr
     * @returns {*}
     */
    static mode(arr) {
        return arr.reduce(function (current, item) {
            let val = current.numMapping[item] = (current.numMapping[item] || 0) + 1;
            if (val > current.greatestFreq) {
                current.greatestFreq = val;
                current.mode = item;
            }
            return current;
        }, {mode: null, greatestFreq: -Infinity, numMapping: {}}, arr).mode;
    }

    /**
     * @param {Object} data
     * @param {string} id
     * @returns {{ask: string, bid: string}}
     */
    static processRate(data, id) {
        const exchanger = data.organizations.filter(function (obj) {
            return obj.orgType === 2;
        });
        let bid = [];
        let ask = [];

        for (let key in exchanger) {
            let e = exchanger[key];
            if (e.currencies.hasOwnProperty(id)) {
                bid.push(parseFloat(e.currencies[id].bid));
                ask.push(parseFloat(e.currencies[id].ask));
            }
        }

        bid = RateController.mode(bid);
        ask = RateController.mode(ask);

        return {
            ask: ask.toFixed(2),
            bid: bid.toFixed(2)
        };
    }
}

module.exports = RateController;
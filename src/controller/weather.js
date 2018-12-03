"use strict";

const request = require('request');
const BaseController = cb_require('controller/base');

class WeatherController extends BaseController {
    /**
     * @param {TelegramBot} bot
     * @param {Logging} logging
     */
    constructor(bot, logging) {
        super(bot, logging);

        this.weather = {
            c: 'Ясно',
            lc: 'Местами облачно',
            hc: 'Облачно',
            s: 'Местами дождь',
            lr: 'Дождь',
            hr: 'Сильный дождь',
            t: 'Гроза',
            h: 'Град',
            sl: 'Мокрый снег...',
            sn: 'Снег',
        };
    }

    /**
     * @param {Object} msg
     */
    process(msg) {
        const chat = msg.chat.id;
        const t = this;
        t.bot.sendChatAction(chat, 'typing');
        request({
            url: 'https://www.metaweather.com/api/location/924938/',
            json: true
        }, function (error, response, jsonWeather) {
            let today = jsonWeather.consolidated_weather[0];
            const message = 'Погода в Киеве сегодня:\n' +
                'От ' + Math.round(today.min_temp) + '°C до ' + Math.round(today.max_temp) + '°C \n' +
                t.weather[today.weather_state_abbr] + '\n' +
                'Давление около ' + Math.round(today.air_pressure) + ' миллибар\n' +
                'Влажность ' + Math.round(today.humidity) + '%';
            setTimeout(function () {
                t.bot.sendMessage(chat, message, {
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id
                });
            }, 500)
        });
    }
}

module.exports = WeatherController;
import * as test from 'unit.js';
import Bot from '../';
import messages from './messages.json';

/**
 * CogniCity Bot module testing harness
 **/
export default function() {
  describe('Bot Testing', function() {
    const config = {};
    config.CARDS_API = 'https://data.cognicity.com/cards/';
    config.CARDS_API_KEY = '123';
    config.CARDS_URL = 'https://cards.cognicity.com/';
    config.PREP_URL = 'https://cards.cognicity.com/prep/';
    config.DEFAULT_LANGUAGE = 'en';
    config.MAP_URL = 'https://map.cognicity.com/';
    config.MESSAGES = messages;

    const bot = new Bot(config);
    const oldCardsAxios = bot.cards.axios;
    let cardCreated = true;
    let axiosError = false;

    // Setup mocks
    beforeEach('Mock axios', function() {
        bot.cards.axios = {
            post: function(address, body, headers) {
                return new Promise((resolve, reject) => {
                    if (axiosError === false) {
                        resolve({
                            data: {
                                created: cardCreated,
                                cardId: 1,
                            },
                        });
                    } else {
                        reject(new Error(`Axios error`));
                    }
                });
            },
        };
    });

    // Tests
    it('Creates an instance of the class', function() {
      test.value(bot instanceof Bot).is(true);
    });

    it('Provides default message', function(done) {
        const props = {
            language: 'id',
        };
        bot.default(props)
            .then((message) => {
                test.value(message.text).is(
                '[ID] RiskMap bot helps you report ' +
                'flooding in realtime. Send /flood to report. ' +
                'In life-threatening situations call 911.');
                done();
            });
    });

    it('Provides default message - unknown language', function(done) {
        const props = {
            language: 'zz',
        };
        bot.default(props)
            .then((message) => {
                test.value(message.text).is(
                'RiskMap bot helps you report ' +
                'flooding in realtime. Send /flood to report. ' +
                'In life-threatening situations call 911.');
                done();
            });
    });

    it('Provides card message', function(done) {
        const props = {
            language: 'id',
            network: 'twitter',
        };
        bot.card(props)
            .then((message) => {
                test.value(message.text).is(
                '[ID] Please report using this ' +
                'one-time link ');
                test.value(message.link).is(
                    'https://cards.cognicity.com/1'
                );
                done();
            });
    });

    it('Provides card message - unknown language', function(done) {
        const props = {
            language: 'zz',
            network: 'twitter',
        };
        bot.card(props)
            .then((message) => {
                test.value(message.text).is(
                'Please report using this ' +
                'one-time link ');
                test.value(message.link).is(
                    'https://cards.cognicity.com/1'
                );

                test.value(message.prepLink).is(
                    'https://cards.cognicity.com/prep/1'
                );
                done();
            });
    });

    it('Catches error getting card id', function(done) {
        const props = {
            language: 'id',
            network: 'twitter',
        };
        cardCreated = false;
        bot.card(props)
            .catch((err) => {
                test.value(err.message).is(
                'Could not get new card from ' +
                'server. Result was {"created":false,"cardId":1}');
                done();
            });
    });

    it('Catches generic axios error', function(done) {
        const props = {
            language: 'id',
            network: 'twitter',
        };
        cardCreated = true;
        axiosError = true;
        bot.card(props)
            .catch((err) => {
                test.value(err.message).is('Axios error');
                done();
            });
    });

    it('Provides thanks message', function(done) {
        const props = {
            language: 'id',
            instanceRegionCode: 'jbd',
            reportId: '1',
        };
        bot.thanks(props)
            .then((message) => {
                test.value(message.text).is(
                '[ID] Thank you for your report. ' +
                'You can access it using this link ');
                test.value(message.link).is(
                    'https://map.cognicity.com/jakarta/?id=1'
                );
                done();
            });
    });

    it('Provides thanks message - unknown language', function(done) {
        const props = {
            language: 'zz',
            instanceRegionCode: 'jbd',
            reportId: '1',
        };
        bot.thanks(props)
            .then((message) => {
                test.value(message.text).is(
                'Thank you for your report. ' +
                'You can access it using this link ');
                test.value(message.link).is(
                    'https://map.cognicity.com/jakarta/?id=1'
                );
                done();
            });
    });

    it('Catches thanks message - unknown region', function(done) {
        const props = {
            language: 'zz',
            instanceRegionCode: 'zzz',
            reportId: '1',
        };
        bot.thanks(props)
            .catch((err) => {
                test.value(err.message).is('Instance region not found');
                done();
            });
    });


    // Restore mocks
    after('Restore mocks', function() {
        bot.cards.axios = oldCardsAxios;
    });
  });
}


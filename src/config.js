require('dotenv').config({silent: true});

var config = {
    channelAccessToken: process.env.ACCESSTOKEN,
    channelSecret: process.env.CHANNELSECRET,
    API_GW_WEBHOOK: process.env.API_GW_WEBHOOK,

    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDSAPIKEY,
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/flood/',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
    DEFAULT_INSTANCE_COUNTRY_CODE: process.env.DEFAULT_INSTANCE_COUNTRY_CODE || 'us',
    DEFAULT_INSTANCE_REGION_CODE: process.env.DEFAULT_INSTANCE_REGION_CODE,
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
};

module.exports = config;

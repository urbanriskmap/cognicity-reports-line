import axios from 'axios';

/**
 * Cards class - get CogniCity report card links
 * @class Cards
 */
export default class Cards {
    /**
     * Constructor for class Cards
     * @param {Object} config - configuration object
     * @param {String} config.CARDS_API - cards endpoint
     * @param {String} config.CARDS_API_KEY - cards endpoint API key
     */
    constructor(config) {
        this.config = config;
        this.axios = axios;
    }
    /**
     * getCard - get a new CogniCity card
     * @param {Object} properties - card request properties
     * @param {String} properties.userId - unique user identifier
     * @param {String} properties.network - user network (e.g. 'Telegram')
     * @param {String} properties.language - user language code (e.g. 'en')
     * @return {Promise} Request response
     */
    getCardId(properties) {
        return new Promise((resolve, reject) => {
            const headers = {
                'headers': {
                    'x-api-key': this.config.CARDS_API_KEY,
                },
            };

            const body = {
                username: properties.userId,
                network: properties.network,
                language: properties.language,
            };

            // TODO verify whether res.statusCode is an object on this endpoint.
            this.axios.post(this.config.CARDS_API, body, headers)
                .then((res) => {
                    if (res.data.created === true) {
                        resolve(res.data.cardId);
                    } else {
                        reject(new Error(`Could not get new card from server.` +
                            ` Result was ` + JSON.stringify(res.data)));
                    }
                })
                .catch((err) => reject(err));
        });
    }
}

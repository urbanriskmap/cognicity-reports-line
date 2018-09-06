import regions from './lib/regions';
import Cards from './lib/cards';
import Replies from './lib/replies';

/**
 * Bot class - Prepated statements for CogniCity chatbot
 * @class Bot
 */
export default class Bot {
  /**
   * constructor for class Bot
   * @param {Object} config - bot parameters
   * @param {String} config.CARDS_API - cards endpoint
   * @param {String} config.CARDS_API_KEY - cards endpoint API key
   * @param {String} config.CARDS_URL - client card resources
   * @param {String} config.DEFAULT_LANGUAGE - default language
   * @param {String} config.MAP_URL - client address for map
   * @param {Object} config.MESSAGES - vocabulary object for bot
   */
  constructor(config) {
    // Config
    this.config = config;

    // Setup language and messaging
    this.replies = new Replies(config);

    // Cards class for handling card requests
    this.cards = new Cards(config);

    // Regions constants for replies
    this.regions = regions;
    }

  /**
   * sendCard - Method to send report card to Telegram user
   * @method sendCard
   * @param {Object} properties - properties of message to send
   * @param {String} properties.language - language of response
   * @param {String} properties.network - network name for response
   * @param {String} properties.userId - user ID
   * @return {String} - message to send
   */
  card(properties) {
    return new Promise((resolve, reject) => {
      // Get a card id
    this.cards.getCardId(properties)
    .then((cardId) => {
        // Build the response
    properties.cardId = cardId;
        const message = this.replies.card(properties);
        // Return the message
        resolve(message);
      }).catch((err) => {
        reject(err);
        });
    });
  }

  /**
   * sendThanks - Method to send report link to Telegram user
   * @method sendThanks
   * @param {Object} properties - properties of message to send
   * @param {String} properties.reportId - report identifier for uniquie link
   * @param {String} properties.language - language of response
   * @param {String} properties.instanceRegionCode - CogniCity region code
   * @return {Promise} - result of _sendMessage request
   */
  thanks(properties) {
    return new Promise((resolve, reject) =>{
      const region = this.regions(properties.instanceRegionCode);
      if (region === null) reject(new Error(`Instance region not found`));
      else {
        properties.regionName = region;
        const message = this.replies.thanks(properties);
        resolve(message);
      }
    });
  }

  /**
   * sendDefault - Method to send default message Telegram user
   * @method sendDefault
   * @param {Object} properties - properties of message to send
   * @param {String} properties.language - language of response
   * @return {Promise} - result of _sendMessage request
   */
  default(properties) {
    return new Promise((resolve, reject) => {
      const message = this.replies.default(properties);
      resolve(message);
    });
  }
}

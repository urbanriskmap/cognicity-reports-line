/**
 * Class for constructing CogniCity bot messages
 * @class Messages
 */
export default class Replies {
  /**
   * Constructor for Messages class
   * @param {Object} config - class configuration
   * @param {String} config.cardsUrl - client endpoint for cards
   * @param {String} config.DEFAULT_LANGUAGE - bot messages object
   * @param {Object} config.MESSAGES - bot messages object

   */
  constructor(config) {
    this.cardsUrl = config.CARDS_URL;
    this.prepUrl = config.PREP_URL;
    this.assessmentUrl = config.ASSESSMENT_URL;
    this.defaultLanguage = config.DEFAULT_LANGUAGE;
    this.mapUrl = config.MAP_URL;
    this.messages = config.MESSAGES;
  }

  /**
   * Construct default message
   * @param {Object} properties - properties for message
   * @param {String} properties.language - user language code
   * @return {Object} - reply object
   */
  default(properties) {
    let text = this.messages[this.defaultLanguage].texts.default;

    if (properties.language in this.messages) {
      text = this.messages[properties.language].texts.default;
    }
    const response = {text: text};
    return response;
  }

  /**
   * Construct card message
   * @param {Object} properties - properties for message
   * @param {String} properties.language - user language code
   * @param {String} properties.cardId - card ID
   * @return {Object} - reply object
   */
  card(properties) {
    let text = this.messages[this.defaultLanguage].texts.card;
    let link = this.cardsUrl +properties.cardId;
    let prepLink = this.prepUrl + properties.cardId;
    let assessmentLink = this.assessmentUrl + properties.cardId;

    if (properties.language in this.messages) {
      text = this.messages[properties.language].texts.card;
    }
    const response = {
      text: text,
      link: link,
      prepLink: prepLink,
      assessmentLink: assessmentLink,
    };
    return response;
  }

  /**
   * Construct thanks message
   * @param {Object} properties - properties for message
   * @param {String} properties.language - user language code
   * @param {String} properties.regionName - region name for map link
   * @param {String} properties.reportId - report ID
   * @return {Object} - reply object
   */
  thanks(properties) {
    let text = this.messages[this.defaultLanguage].texts.thanks;
    let link = this.mapUrl + properties.regionName +
    '/?id=' + properties.reportId;

    if (properties.language in this.messages) {
      text = this.messages[properties.language].texts.thanks;
    }
    const response = {text: text, link: link};
    return response;
  }
}

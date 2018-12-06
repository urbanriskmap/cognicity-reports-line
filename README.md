# cognicity-reports-line

## Line Bot
Allows Line users to submit flood reports via text message chat bot.
Part of the CogniCity platform, deployed for [Urban Risk Map](https://riskmap.us).

This module deploys two AWS lambda functions:
1. A webhook for incoming messages from Line
2. A reply function to send confirmation messages

### Install
`npm install`

### Requirements
- CogniCity:
    * This function is designed to work with Cognicity Server v3.0.6 or later, running CogniCity Schema v3.0.7 or later.
- Node:
    * v8.10 or later (ES6 syntax is transpiled using Babel)

### Getting started
* Create Telegram bot as explained [here](https://line.github.io/line-bot-sdk-nodejs/#getting-started)
* Create two AWS API gatway endpoints for the webhook and send functions
* Add the appropriate parameters in `src/config` and `.env`.
* Send a text to your Line bot to test if it is up and running!


### Test
`npm run test`

### Configuration
* `ACCESSTOKEN`: Line access token to trigger the webhook function
* `CHANNELSECRET`: Line channel secret code created on creating a Telegram bot
* `API_GW_WEBHOOK`: CogniCity server endpoint to get unique report card links
* `CARDS_API`: Array of [flood,prep] for what decks should be deployed
* `CARDSAPIKEY`: CogniCity server API key
* `CARDS_URL`: Client address for cards
* `PREP_URL`: Client address for prep cards
* `DEFAULT_INSTANCE_COUNTRY_CODE`: Default country for message files (e.g. 'us')
* `DEFAULT_LANGUAGE`: Current default language is English. You can add more languages here and parameterize replies for each language


#### Misc Notes
- Depending on your deployment method you may need to add the above parameters to the Lambda functions in the AWS web console

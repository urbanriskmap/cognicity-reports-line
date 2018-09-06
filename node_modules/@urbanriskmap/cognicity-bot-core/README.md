[![Build Status](https://travis-ci.org/urbanriskmap/cognicity-bot-core.svg?branch=master)](https://travis-ci.org/urbanriskmap/cognicity-bot-core) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-bot-core/badge.svg?branch=master)](https://coveralls.io/github/urbanriskmap/cognicity-bot-core?branch=master) [![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) 

# CogniCity Bot Core Package
Core language functionality for CogniCity chatbots

### About
NodeJS package to create language for CogniCity chatbots operating on social media:
- can fetch report card from CogniCity server and prepare a unique link for user to submit flood report
- composes thank you message containing unique report ID
- provides default message to send to users

### Installation

```sh
npm i cognicity-bot-core
```

### Use

```javascript
import Bot from 'cognicity-bot-core';

// Messages object provides the bot with a vocabulary
const messages = {
    en: {
      texts: {
        default: "RiskMap bot helps you report flooding in realtime. Send /flood to report. In life-threatening situations call 911.",
        card: "Please report using this one-time link ",
        thanks: "Thank you for your report. You can access it using this link "
      }
    }
}

// Configuration object
const config = {
    CARDS_API: 'https://data.cognicity.com/cards/', // CogniCity data server cards endpoint
    CARDS_API_KEY: '123',                           // CogniCity data server API key
    CARDS_URL: 'https://cards.cognicity.com/',      // Client URL for cards resources
    DEFAULT_LANGUAGE: 'en',                         // Default language for messages
    MAP_URL: 'https://map.cognicity.com/',          // Client URL for map
    MESSAGES: messages                              // Vocabulary object created above
}

// Initialize
const bot = new Bot(config);

// Get a default message
const properties = {
    language: 'id'      // language of the user
}
const message = bot.default(properties);

// Get a report card message (bot will make a request to CogniCity server)
const properties = {
    language: 'id',     // language of the user
    network: 'twitter'  // user's network 
}
const message = bot.card(properties);

console.log(message.text); // language to send to user
console.log(message.link); // link to send to user

// Get a thank you message for a specified report
const properties = {
    language: 'id',             // language of the user
    instanceRegionCode: 'jbd',  // CogniCity instance region of the report
    reportId: '1'               // CogniCity report id
}
const message = bot.thanks(properties);

console.log(message.text); // language to send to user
console.log(message.link); // link to send to user
```

### Tests

```sh
npm run test
```

### Build

```sh
npm run build
```

### Code Style
- Google ES6 specification

### Release
The release procedure is as follows:
* Update the CHANGELOG.md file with the newly released version, date, and a high-level overview of changes. Commit the change.
* Create a tag in git from the current head of master. The tag version should be the same as the version specified in the package.json file - this is the release version.
* Update the version in the package.json file and commit the change.
* Further development is now on the updated version number until the release process begins again.


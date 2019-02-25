import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
const line = require('@line/bot-sdk');


export default class Linebot {

  constructor(config) {
    this.config = config;
    this.config.MESSAGES = require('./messages-' +
    this.config.DEFAULT_INSTANCE_COUNTRY_CODE +
    '.json');
    this.bot = new Bot(this.config);
    this.client = new line.Client(this.config);
    this.axios = axios;
  }


  sendLink(id, replyToken, disasterType) {
    console.log('Sending new ' + disasterType + ' link');
    return new Promise((resolve, reject) => {
      let properties = {
        userId: String(id),
        language: this.config.DEFAULT_LANGUAGE,
        network: 'line',
      };
      properties.language = 'en';
      this.bot.card(properties)
      .then((msg) => {
        console.log('Got a new card from bot');
        console.log(msg);
        let link = msg.text + msg.link;
        if (disasterType === "Prep") {
          link = msg.text + msg.prepLink;
        }
        let reply = {
          "type": "text",
          "text": link
        };
        resolve(this.client.replyMessage(replyToken, reply));
      }).catch((err) => reject(err));
    });
  }

  sendThanks(event) {
    return new Promise((resolve, reject) => {
      let body = JSON.parse(event.body);
      let userId = body.userId;

      if (body.instanceRegionCode === 'null') {
        // catch reports outside the reporting area and reply a default
        body.instanceRegionCode = this.config.DEFAULT_INSTANCE_REGION_CODE;
      }
      console.log('Line sendThanks request');
      console.log(body);
      this.bot.thanks(body)
      .then((msg) => {
        let link = msg.text + msg.link;
        let reply = {
          "type": "text",
          "text": link
        };
        console.log('Sending thanks to user: ' + String(userId));
        resolve(this.client.pushMessage(userId, reply));
        // Christina: Maybe we can also re-send the intro prompt here
      }).catch((err) => reject(err));
    });
  }

  // Handle non-message events
  handleEvent(event) {
    let body = JSON.parse(event.body);
    let replyToken = body.events[0].replyToken;
    let eventType = body.events[0].type;
    var reply = {};

    if (eventType === "memberJoined" || eventType === "join") {
      reply = {
        "type": "template",
        "altText": "shelter selection",
        "template": {
          "type": "buttons",
          "actions": [
            {
              "type": "uri",
              "label": "Select on map",
              "uri": "line://nv/location"
            },
            {
              "type": "message",
              "label": "Select from list",
              "text": "shelter list"
            }
          ],
          "title": "Shelter Selection",
          "text": "Please select your shelter."
        }
      };
    } else {
        reply = {
          "type":"text",
          "text":`Oops! No handler found for event type ${eventType}`
        };
    }
    this.client.replyMessage(replyToken, reply);
  }

  // Primitive responder to certain messages
  processMessage(event){
    let body = JSON.parse(event.body);
    let replyToken = body.events[0].replyToken;
    const message = body.events[0].message.text.toLowerCase().trim();
    let id = body.events[0].source.userId;
    // const memberJoined = body.events[0].type; //a new member joines a group or a room - returns as "memberJoined"

    if (message === "joined") {
      let reply = {
        "type": "text",
        "text": "Know what RiskMap can do? Type start!",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "Start",
                "text": "Start"
              }
            }
          ]
        }
      };
      this.client.replyMessage(replyToken, reply);
    }

    else if (message === "flood" || message === "prep") {
      this.sendLink(id, replyToken, message)
      .catch((err) => console.log(err));
    }


    else if (message === "report") {
      let m = [
        {
          "type":"text",
          "text":"What would you like to report?"
        },
        {
          "type": "template",
          "altText": "report carousel",
          "template": {
            "type": "carousel",
            "actions": [],
            "columns": [
              {
                "text": "Flood",
                "actions": [
                  {
                    "type": "message",
                    "label": "Select",
                    "text": "flood"
                  }
                ]
              },
              {
                "text": "Infrastructure Failure",
                "actions": [
                  {
                    "type": "message",
                    "label": "Select",
                    "text": "prep"
                  }
                ]
              },
            ]
          }
        },
      ];
      this.client.replyMessage(replyToken, m);
    }

    // testing -  bot is added to a group or a member joins
    else if (message === "shelter") {
      let m = [
        {
          "type":"text",
          "text":"What is your shelter?"
        },
        {
          "type": "template",
          "altText": "shelter selection",
          "template": {
            "type": "buttons",
            "actions": [
              {
                "type": "uri",
                "label": "Map",
                "uri": "line://nv/location"
              },
              {
                "type": "message",
                "label": "List",
                "text": "list"
              }
            ],
            "text": "Choose a selection method."
          }
        }
      ];

      // let reply = {
      //   "type": "template",
      //   "altText": "shelter selection",
      //   "template": {
      //     "type": "buttons",
      //     "actions": [
      //       {
      //         "type": "uri",
      //         "label": "Map",
      //         "uri": "line://nv/location"
      //       },
      //       {
      //         "type": "message",
      //         "label": "List",
      //         "text": "list"
      //       }
      //     ],
      //     "title": "Shelter Selection",
      //     "text": "What is your shelter? Choose a selection method."
      //   }
      // };
      this.client.replyMessage(replyToken, m);
    }

// Do we want to remember the state that we were last in? (so that a typo doesn't send you back to the beginning)
// Or we can just have the chatbot not respond
    else {
      // let reply = {
      //     "type": "text",
      //     "text": "Please send 'Flood' to report flooding. Send 'Prep' to report infrastructure failure. In life-threatening situations contact emergency services."
      //  };
      let reply = {
        "type": "template",
        "altText": "Riskmap Default Message",
        "template": {
          "type": "buttons",
          "actions": [
            {
              "type": "uri",
              "label": "View Map",
              "uri": "https://riskmap.in/"
            },
            {
              "type": "message",
              "label": "Send Report",
              "text": "report"
            }
          ],
          "title": "Riskmap Intro",
          "text": "What would you like to do?"
        }
      };
      this.client.replyMessage(replyToken, reply);
    }

  }

}

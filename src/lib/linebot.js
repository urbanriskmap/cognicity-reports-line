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
    return new Promise((resolve, reject) => {
      let properties = {
        userId: String(id),
        language: this.config.DEFAULT_LANGUAGE,
        network: 'line',
      };         
      properties.language = 'en'; 
      this.bot.card(properties)
      .then((msg) => {
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
      let body = event.body;
      let replyToken = body.events[0].replyToken;

      if (body.instanceRegionCode === 'null') {
        // catch reports outside the reporting area and reply a default
        body.instanceRegionCode = this.config.DEFAULT_INSTANCE_REGION_CODE;
      }
      this.bot.thanks(body)
      .then((msg) => {
	let link = msg.text + msg.link;        
	let reply = {
         "type": "text",
         "text": link
       };
      resolve(this.client.replyMessage(replyToken, reply));
      }).catch((err) => reject(err));
    });
  }

  processMessage(event){
    let body = JSON.parse(event.body);
    let replyToken = body.events[0].replyToken;
    const message = body.events[0].message.text;
    let id = body.events[0].source.userId;      
    
    if (message === "joined" || message === "Joined" || message === "JOINED") {
      let reply = {
	    "type": "text", 
	    "text": "Know what RiskMap can do?? Type start!!!",
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
  
  else if (message === "Start" || message === "start" || message === "START") {
    let reply = {
      "type": "text",
      "text": "RiskMap bot sends you a one-time link to submit a report based on your inputs. Send flood to report floods or prep to report flood preparation related grievances.",
       "quickReply": {
        "items": [
          {
            "type": "action", 
            "action": {
              "type": "message",
              "label": "Flood",
              "text": "Flood"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "Prep",
              "text": "Prep"
            }
          }
        ]
      }
    };
    this.client.replyMessage(replyToken, reply);
  }
  
  else if (message === "Flood" || message === "Prep") {
     this.sendLink(id, replyToken, message)
	.catch((err) => console.log(err));
  }

  else {
     let reply = {
         "type": "text",
         "text": "Unknown Command !!!"
      };
     this.client.replyMessage(replyToken, reply);
  }    

 }

}

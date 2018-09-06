'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cognicityBotCore = require('@urbanriskmap/cognicity-bot-core');

var _cognicityBotCore2 = _interopRequireDefault(_cognicityBotCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var line = require('@line/bot-sdk');

var Linebot = function () {
  function Linebot(config) {
    _classCallCheck(this, Linebot);

    this.config = config;
    this.config.MESSAGES = require('./messages-' + this.config.DEFAULT_INSTANCE_COUNTRY_CODE + '.json');
    this.bot = new _cognicityBotCore2.default(this.config);
    this.client = new line.Client(this.config);
    this.axios = _axios2.default;
  }

  _createClass(Linebot, [{
    key: 'sendLink',
    value: function sendLink(id, replyToken) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var properties = {
          userId: String(id),
          language: _this.config.DEFAULT_LANGUAGE,
          network: 'line'
        };
        properties.language = 'en';
        _this.bot.card(properties).then(function (msg) {
          var reply = {
            "type": "text",
            "text": msg
          };
          resolve(_this.client.replyMessage(replyToken, reply));
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: 'processMessage',
    value: function processMessage(event) {
      var body = JSON.parse(event.body);
      var replyToken = body.events[0].replyToken;
      var message = body.events[0].message.text;
      var id = body.events[0].source.userId;

      if (message === "joined" || message === "Joined" || message === "JOINED") {
        var reply = {
          "type": "text",
          "text": "Know what RiskMap can do?? Type start!!!",
          "quickReply": {
            "items": [{
              "type": "action",
              "action": {
                "type": "message",
                "label": "Start",
                "text": "Start"
              }
            }]
          }
        };
        this.client.replyMessage(replyToken, reply);
      } else if (message === "Start" || message === "start" || message === "START") {
        var _reply = {
          "type": "text",
          "text": "RiskMap bot sends you a one-time link to submit a report based on your inputs. Send flood to report floods or prep to report flood preparation related grievances.",
          "quickReply": {
            "items": [{
              "type": "action",
              "action": {
                "type": "message",
                "label": "Flood",
                "text": "Flood"
              }
            }, {
              "type": "action",
              "action": {
                "type": "message",
                "label": "Prep",
                "text": "Prep"
              }
            }]
          }
        };
        this.client.replyMessage(replyToken, _reply);
      } else if (message === "Flood" || message === "flood" || message === "FLOOD") {
        this.sendLink(id, replyToken).catch(function (err) {
          return console.log(err);
        });
      } else {
        var _reply2 = {
          "type": "text",
          "text": "Unknown Command !!!"
        };
        this.client.replyMessage(replyToken, _reply2);
      }
    }
  }]);

  return Linebot;
}();

exports.default = Linebot;
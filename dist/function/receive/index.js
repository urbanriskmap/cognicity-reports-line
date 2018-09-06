'use strict';

var _linebot = require('../../lib/linebot');

var _linebot2 = _interopRequireDefault(_linebot);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');

exports.handler = function (event, context) {
  var signature = crypto.createHmac('sha256', _config2.default.channelSecret).update(event.body).digest('base64');
  var checkHeader = (event.headers || {})['X-Line-Signature'];

  if (signature === checkHeader) {
    var linebot = new _linebot2.default(_config2.default);
    linebot.processMessage(event);
  } else {
    console.log('Error');
  }
};
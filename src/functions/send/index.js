import Linebot from '../../lib/linebot';
import config from '../../config';
const crypto = require('crypto');

export default (event, context, callback) => {
  // authentication is done via x-api-key on AWS API gateway
  console.log('Got send request');
  console.log(event);
  const linebot = new Linebot(config);
  linebot.sendThanks(JSON.parse(event))
};


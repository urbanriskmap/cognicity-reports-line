import Linebot from '../../lib/linebot';
import config from '../../config';
const crypto = require('crypto');

export default (event, context, callback) => {
  console.log('Got send request');
  console.log(event);
  let signature = crypto.createHmac('sha256', config.channelSecret).update(event.body).digest('base64');
  let checkHeader = (event.headers || {})['X-Line-Signature'];

  if (signature === checkHeader) {
    console.log('Signature matches, sending thanks!');
    const linebot = new Linebot(config);  
    linebot.sendThanks(event)
  }else{
    console.log('Error, signature does not match header');
    console.log(event);
  }
};


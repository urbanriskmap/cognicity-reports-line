import Linebot from '../../lib/linebot';
import config from '../../config';
const crypto = require('crypto');

exports.handler = function (event, context) {
 let signature = crypto.createHmac('sha256', config.channelSecret).update(event.body).digest('base64');
 let checkHeader = (event.headers || {})['X-Line-Signature'];
 
 if (signature === checkHeader) {
   const linebot = new Linebot(config);  
       linebot.sendThanks(event)
 }else{
   console.log('Error');
 }
};




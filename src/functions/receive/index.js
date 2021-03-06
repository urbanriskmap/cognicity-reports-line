import Linebot from '../../lib/linebot';
import config from '../../config';
const crypto = require('crypto');

export default (event, context, callback) => {
// exports.handler = function (event, context) {
 console.log('Got webhook request');
 console.log(event);
 let signature = crypto.createHmac('sha256', config.channelSecret).update(event.body).digest('base64');
 let checkHeader = (event.headers || {})['X-Line-Signature'];
 
 if (signature === checkHeader) {
   console.log('Processing webhook message');
   const linebot = new Linebot(config);  
       linebot.processMessage(event)
 }else{
   console.log('Error, signature does not match header');
   console.log(event);
 }
};




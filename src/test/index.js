import * as test from 'unit.js';

import Linebot from '../lib/linebot';
import config from '../config';

/**
 * Twitter library function testing harness
 */
export default function() {
  describe('Line bot testing', function() {
   const linebot = new Linebot(config);
    let postRequestError = false;

    before(function() {

      // Mock process message
      linebot.processMessage = function(body) {
        return new Promise((resolve, reject) => {
          resolve({link: 'thanks link', text: 'thanks text'});
        });
      };

      it('Creates class', function(done) {
        test.value(linebot instanceof Linebot).is(true);
        done();
      });
	
    after(function() {

    });
  });
});
}

'use strict';

var isNode = typeof window === 'undefined'

function stubFetchAPI(spy, data, dataType) {
  data = data || {};
  sinon.stub(global, 'fetch', function(path, options) {
    return {
      then: function(callback1) {
        var response = {};
        if (dataType) {
          response[dataType] = spy;
        }
        else {
          response.json = spy;
          response.text = spy;
        }
        callback1.call(this, response);
        return {
          then: function(callback2) {
            callback2.call(this, data);
            return {
              catch: function(callback3) {
                callback3.call(this, new Error(''));
              }
            }
          }
        }
      }
    }
  });
}

if (typeof module !== 'undefined') module.exports = { stubFetchAPI: stubFetchAPI };

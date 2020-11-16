'use strict'
const soap = require('soap');

class SoapController {
  async createClient() {
    const url = 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL';
    const args = {ubiNum: 123};
    soap.createClient(url, function(err, client) {
      client.NumberToWords(args, function(err, result, rawResponse, soapHeader, rawRequest) {
        // console.log(result, rawResponse);
      });
      // const srv = client.describe() // returns
      // {
      //   MyService: {
      //     MyPort: {
      //       MyFunction: {
      //         input: {
      //           name: 'string'
      //         }
      //       }
      //     }
      //   }
      // }
      // console.log(srv);
      // client.NumberToWords(args, function(err, result, rawResponse, soapHeader, rawRequest) {
      //   console.log(result);
      // })
    });
  }
  getOppId({ request, response }) {
    return {
      MyService: {
        MyPort: {
          MyFunction: function (args) {
            return {
              name: args.name
            };
          },

          // This is how to define an asynchronous function with a callback.
          MyAsyncFunction: function (args, callback) {
            // do some work
            callback({
              name: args.name
            });
          },

          // This is how to define an asynchronous function with a Promise.
          MyPromiseFunction: function (args) {
            return new Promise((resolve) => {
              // do some work
              resolve({
                name: args.name
              });
            });
          },

          // This is how to receive incoming headers
          HeadersAwareFunction: function (args, cb, headers) {
            return {
              name: headers.Token
            };
          },

          // You can also inspect the original `req`
          reallyDetailedFunction: function (args, cb, headers, req) {
            console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
            return {
              name: headers.Token
            };
          }
        }
      }
    };
  }
}

module.exports = SoapController

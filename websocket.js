import chalk from 'chalk';
import path from 'path';
import async from 'async';
import nconf from 'nconf';
import {createClient} from './src/lib/redisClient';

// Hapi server imports
import Hapi from 'hapi';
import Nes from 'nes';
const server = new Hapi.Server();
let config, subClient;
const sendMessage = function(channel, message) {
        var _channel = channel.split(":"),
            subChannel = _channel[1];

        switch(subChannel) {
          case "classattendanceupdate":
            server.publish('/attendance', {type:"UPDATE_DIVISION_CLASS_ATTENDANCE_FULFILLED", payload:{data: message}});
            break;
          case "last8attendanceupdate":
            server.publish('/attendance', {type:"UPDATE_ATTENDANCE_FULFILLED", payload:{data: message}});
            break;
          default:
            break;
        }
      },
      setSubscription = function() {
        subClient.psubscribe("congregate:*");
        console.log("Subscribing");
        subClient.on("pmessage", function (pattern, channel, message) {
          console.log("channel ", channel, ": ", message);
          message = JSON.parse(message);
          sendMessage(channel, message);
        });
      };
// Start server function
config = nconf.argv()
 .env()
 .file({ file: 'config/settings.json' });

createClient().then(
  function(client) {
    subClient = client;
    setSubscription();
  }
);

server.connection(
  {
    host: config.get("websocket:host"),
    port: config.get("websocket:port")
  }
);
// Webpack compiler

// Register Hapi plugins
server.register(
  Nes,
  ( error ) => {
    if ( error ) {
      console.error( error );
    }

    server.subscription('/attendance');
    server.start(
      (err) => {
        console.log( '==> Websocket Server is listening on', server.info.uri );
      }
    );
  }
);

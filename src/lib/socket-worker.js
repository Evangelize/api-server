// import ReconnectingWebsocket from 'reconnectingwebsocket';
var client;
var connected = false;
const ReconnectableWebSocket = require('reconnectable-websocket');
self.onClientMessage = function (data) {
  postMessage(data.data);
};

self.sendClientMessage = function (data) {
  if (connected) {
    client.send(JSON.stringify(data));
  }
};

onmessage = function (event) {
  const data = event.data;
  console.log('worker', data);
  if (data.type === 'connect') {
    client = new ReconnectableWebSocket(data.payload.url);
    client.open();
    console.log('websocket', client);
    connected = true;
    client.onmessage = self.onClientMessage;
    client.onopen = self.onClientMessage;
  } else if (data.type === 'test') {
    console.log('test');
  } else {
    self.sendClientMessage(data.payload);
  }
};

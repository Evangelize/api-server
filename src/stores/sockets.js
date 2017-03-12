import Worker from '../lib/socket-worker';
import reactCookie from 'react-cookie';
import 'setimmediate';

export default class Sockets {
  socketworker;
  events;

  init(events, options) {
    if (options) {
      this.options = options;
    }
    if (events) {
      this.setupEvents(events);
    }
    this.setupWs();
  }

  setupWs() {
    const token = reactCookie.load('accessToken');
    if (token) {
      const proto = (window.location.protocol === 'http:') ? 'ws:' : 'wss:';
      this.socketworker = new Worker();
      this.socketworker.onmessage = this.onMessage.bind(this);
      let websocketUri = (window.wsUri) ? window.wsUri : '//localhost:3002';
      websocketUri = `${proto}${websocketUri}?token=${token}`;
      this.socketworker.postMessage({ type: 'connect', payload: { url: websocketUri } });
    }
    return true;
  }

  setupEvents(events) {
    this.events = events;
    this.events.on('socket', this.send.bind(this));
  }

  send(data) {
    const payload = {
      type: 'data',
      payload: data,
    };
    this.socketworker.postMessage(payload);
  }

  onMessage(message) {
    console.log('socket:onMessage', message);
    const data = (message.data) ? JSON.parse(message.data) : {};
    if ('payload' in data) this.events.emit('db', data);
    if (data.type === 'info') this.events.emit('broadcast', data);
  }

}

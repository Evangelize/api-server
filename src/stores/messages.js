import { observable } from 'mobx';

export default class Messages {
  @observable db;
  @observable events;

  constructor(db, events) {
    if (events) {
      this.setupEvents(events);
    }
  }

  setupEvents(events) {
    this.events = events;
  }

  subscribe(channel, cb) {
    this.events.on(channel, cb.bind(this));
  }
}

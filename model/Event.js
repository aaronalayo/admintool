const { Model } = require('objection');

class Event extends Model {
  static get tableName() {
    return 'events';
  }
}

module.exports = Event;
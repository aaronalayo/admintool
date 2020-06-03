const { Model } = require('objection');

class Organization extends Model {
  static get tableName() {
    return 'organisations';
  }
}

module.exports = Organization;
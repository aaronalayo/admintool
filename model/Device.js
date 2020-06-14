const { Model } = require('objection');

const Organization = require('./Organization.js');


class Device extends Model {
  static tableName = 'devices';
    
    static relationMappings = {
      organizations: {
          relation: Model.HasManyRelation,
          modelClass: Organization,
          join: {
            from: 'devices.organization_uuid',
            to: 'organizations.organization_uuid'
          }
      }
  }
};

module.exports = Device;
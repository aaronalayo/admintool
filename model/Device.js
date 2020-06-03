const { Model } = require('objection');

const Organization = require('./Organization.js');

class Device extends Model {
  static tableName = 'devices';
    
    static relationMappings = {
      Organization: {
          relation: Model.HasManyRelation,
          modelClass: Organization,
          join: {
            from: 'devices_organization_uuid',
            to: 'organization.organization_uuid'
          }
      }
  
  }
};

module.exports = Device;
const { Model } = require('objection');

const User = require('./User.js');

class Organization extends Model {
  static tableName = 'organizations';
    
    
    static relationMappings = {
      users: {
          relation: Model.HasManyRelation,
          modelClass: User,
          join: {
            from: 'organizations.organization_uuid',
            to: 'users.id'
          }
      },
  
}

}

module.exports = Organization;
const {Model} = require('objection');

const Role = require('./Role.js');
const Organization = require('./Organization.js')

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        role: {
            relation: Model.BelongsToOneRelation,
            modelClass: Role,
            join: {
              from: 'users.roleId',
              to: 'roles.id'
            }
        },
        organization: {
            relation: Model.BelongsToOneRelation,
            modelClass: Organization,
            join: {
                from: 'users.organization_uuid',
                to: 'organizations.organization_uuid'
            }

        }
    }
}



module.exports = User;
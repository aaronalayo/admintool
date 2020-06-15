const credentials = require("./config/psqlCredentials.js");
const { knexSnakeCaseMappers} = require('objection');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: credentials.host,
      database: credentials.database,
      user:     credentials.user,
      password: credentials.password
    },
    ...knexSnakeCaseMappers()
  }

};
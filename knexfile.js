
// const credentials = require("./config/mysqlCredentials.js");
// const { knexSnakeCaseMappers} = require('objection');

// module.exports = {

//   development: {
//     client: 'mysql',
//     connection: {
//       database: credentials.database,
//       user:     credentials.user,
//       password: credentials.password
//     },
//     ...knexSnakeCaseMappers()
//   }

// };

// const credentials = require("./config/mysqlCredentials.js");
// const { knexSnakeCaseMappers} = require('objection');

// module.exports = {

//   development: {
//     client: 'pg',
//     connection: {
//       database: credentials.database,
//       user:     credentials.user,
//       password: credentials.password
//     },
//     ...knexSnakeCaseMappers()
//   }

// };

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
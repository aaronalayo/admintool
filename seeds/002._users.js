const bcrypt = require('bcrypt');
const saltRounds = 12;

exports.seed = async function(knex) {
  const hashedPassword = await bcrypt.hash('root', saltRounds);
  return knex('roles').select().then(roles =>{
      return knex('users').insert([
        {username: 'admin', password: hashedPassword, email: 'editoraaron@gmail.com', role_id:roles.find(role => role.role ==='ADMIN').id },
      ]);
  });
    
};

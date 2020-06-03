  //DDL= DEFINE = CREATE, DROP(this migration file)
exports.up = function(knex) {
    return knex.schema
    .createTable('roles',(table)=>{
        table.increments('id').notNullable();
        table.string('role').unique().notNullable();
  
    })
    .createTable('users', (table)=> {
          table.increments('id').notNullable();
          table.string('username').unique().notNullable();
          table.string('password').notNullable();
          table.string('email').unique().notNullable();

          table.integer('role_id').unsigned().notNullable();
          table.foreign('role_id').references('roles.id');

          table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
          table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  
    });
    
  };




  
  exports.down = function(knex) {
    //rollback
    return knex.schema
      .dropTableIfExists('users')
      .dropTableIfExists('roles');
  };
  

  //Unsigned 
  //0 000000 +
  //Signed
  //1 000000 -
  //0 000000 +


    //DML DATA MANIPULATION LANGUAGE SELECT,UPDATE,DELETE
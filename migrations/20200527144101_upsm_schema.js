
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


    
        table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
})
.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
     NEW."updated_at"=now(); 
     RETURN NEW;
    END;
    $$ language 'plpgsql';
  `)
  .raw(`
    CREATE TRIGGER update_user_updated_at BEFORE UPDATE
    ON ?? FOR EACH ROW EXECUTE PROCEDURE 
    update_updated_at_column();
  `, ['users']);
  };




  
  exports.down = function(knex) {
    //rollback
    return knex.schema
      .dropTableIfExists('users')
      .dropTableIfExists('roles');
  };

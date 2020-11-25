import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('workers', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('cpf').notNullable();
        table.string('email').notNullable();
        table.string('cellphone').notNullable();
        table.string('bio').notNullable();
        table.string('avatar').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('workers');
}
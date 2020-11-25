import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('quote', table => {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.string('image');

        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('quote');
}
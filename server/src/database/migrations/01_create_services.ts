import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary();
        table.string('category').notNullable();
        table.string('speciallity').notNullable();

        table.integer('worker_id')
            .notNullable()
            .references('id')
            .inTable('workers')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('services');
}
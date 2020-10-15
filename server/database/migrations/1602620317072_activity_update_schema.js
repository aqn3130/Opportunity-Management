'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivityUpdateSchema extends Schema {
  up () {
    this.alter('activities', (table) => {
      // alter table
      table.integer('customer_id').unsigned().references('id').inTable('customers')
    })
  }

  down () {
    this.alter('activity_updates', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ActivityUpdateSchema

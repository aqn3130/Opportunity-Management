'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserUpdateSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      // alter table
      table.dropColumn('password');
    })
  }

  down () {
    this.alter('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserUpdateSchema

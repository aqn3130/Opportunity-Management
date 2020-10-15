'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivitySchema extends Schema {
  up () {
    // this.create('activities', (table) => {
    //   table.increments()
    //   table.integer('Opportunity_fk').unsigned().references('Id').inTable('Opportunity')
    //   table.string('CustomerName')
    //   table.string('BPID')
    //   table.datetime('ActivityDate')
    //   table.string('ContactPerson')
    //   table.string('FollowUpMeeting')
    //   table.string('Likelihood')
    //   table.string('Type')
    //   table.text('Note')
    //   table.timestamps()
    // })
  }

  down () {
    this.drop('activities')
  }
}

module.exports = ActivitySchema

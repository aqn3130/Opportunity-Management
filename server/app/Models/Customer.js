'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {
  /**
   * A relationship on activities is required
   * @method activities
   *
   * @return {Object}
   */
  activities () {
    return this.hasMany('App/Models/Activity')
  }
}

module.exports = Customer

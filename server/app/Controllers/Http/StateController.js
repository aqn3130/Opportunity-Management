'use strict'

class StateController {
  async getStatesList({ request, response }) {
    let query = undefined;
    query = await request.Knex.select('*').from('States')
    return query;
  }
}

module.exports = StateController

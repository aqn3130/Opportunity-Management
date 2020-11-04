'use strict'

class CountryRegionTerritoryController {
  async index ( { request, response, auth } ) {
    const params = request.all()
    let query = undefined;
    if ( params.id ){
      query = await request.Knex('Country_Region_Territory').where('id', params.id)
    } else {
      query = await request.Knex('Country_Region_Territory')
    }
    return query;
  }
  async update( { request, response, auth }) {
    const data = request.all();
    // console.log(data);
    if ( data.id ) {
      await request.Knex('Country_Region_Territory').where('Id', data.id).update(data);
    }
  }
  async create( { request, response, auth }) {
    const data = request.all();
    // console.log(data);
    try {
      return await request.Knex.table('Country_Region_Territory').insert(data);
    } catch (e) {
      console.log(e);
    }
  }
  async delete( { params, request, response, auth } ) {
    const id = params.id;
    await request.Knex('Country_Region_Territory').where({ id: id }).delete()
  }
}

module.exports = CountryRegionTerritoryController

'use strict'

class ProductController {
  async getOppProducts({ request, response }) {
    const params = request.all();
    let query = undefined;
    if (params.id) {
      // console.log('-1');
      query = await request.Knex.select('*')
        .from('Product')
        .joinRaw('Opportunity')
        .where('Opportunity_fk', params.id)
    }
    return query;
  }
  async getProductsList({ request, response }) {
    let query = undefined;
    query = await request.Knex.select('*').from('Products')
    return query;
  }
}

module.exports = ProductController

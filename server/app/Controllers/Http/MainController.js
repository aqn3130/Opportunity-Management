'use strict'
const Env = use('Env');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with mains
 */
class MainController {
  /**
   * Show a list of all mains.
   * GET mains
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const params = request.all();
    try {
      // return await request.Knex.select('*').from(request.Table)

      // return await request.Knex.select('*').from(request.Table).join('Product', function() {
      //   this.on('Opportunity.Id', '=', 'Product.Opportunity_fk').orOn('Opportunity.Id', '=', 'Product.Opportunity_fk')
      // })

      // return await request.Knex.table(request.Table)
      //   .join('Product', 'Opportunity.Id', '=', 'Product.Opportunity_fk')
      //   .groupBy('Product.Id')

      let query = undefined;
      if (params.id) {
        query = await request.Knex.select('*')
          .from('Product')
          .joinRaw('Opportunity')
          .where('Opportunity_fk', params.id)
      }
      else if (params.email){
        query = await request.Knex.select('*')
          .from(request.Table)
          .where('Email', params.email)
      }
      else {
        query = request.Knex.select('*').from(request.Table)
      }
      return query;

      // return await request.Knex.select('*').from('Product').joinRaw('Opportunity').where('Opportunity_fk', 1)

    } catch (e) {
      throw e;
    }

  }

  /**
   * Render a form to be used for creating a new main.
   * GET mains/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new main.
   * POST mains
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { data } = request.all();
    // console.log(data);
    await request.Table.insert(data);
    // await request.table_MaterialCode.insert(data);
  }

  /**
   * Display a single main.
   * GET mains/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing main.
   * GET mains/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {

  }

  /**
   * Update main details.
   * PUT or PATCH mains/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const { id , data } = request.all();
    const rec = await request.Table.where({ id: id });

    data.created_at = rec.created_at;

    const updatedId = await request.Table.where({ id: id })
      .update(data)
    // console.log(updatedId);
  }

  /**
   * Delete a main with id.
   * DELETE mains/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const id = params.id;
    await request.Table.where({ id: id }).delete()
    // await request.table_MaterialCode.where({ id: id }).delete()
  }
}

module.exports = MainController

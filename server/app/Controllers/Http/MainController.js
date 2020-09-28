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
        let page = params.page || 1;
        const perPage = params.perPage || 10;
        const pageInt = parseInt(page);
        const perPageInt = parseInt(perPage);
        let total = await request.Knex.select('*').from(request.Table);
        if (!page) {
          return total;
        }
        total = total.length;
        if ( pageInt === 1 ) page = 0;
        const offset = pageInt * perPageInt - perPageInt;
        query = await request.Knex.select('*').from(request.Table).limit(perPage).offset(offset);
        // console.log(page, offset);
        return {
          totalOpts: total,
          opts: query
        }
      }
      return query;
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
    try {
      await request.Knex.table(request.Table).insert(data);
    } catch (e) {
      console.log(e);
    }
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
    await request.Knex.select('*').from(request.Table).where({ id: id }).update(data)
    // console.log(rec);
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
    await request.Knex(request.Table).where({ id: id }).delete()
  }
}

module.exports = MainController

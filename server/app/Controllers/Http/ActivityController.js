'use strict'
const Activity = use('App/Models/Activity')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with activities
 */
class ActivityController {
  /**
   * Show a list of all activities.
   * GET activities
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
          .from('activities')
          .joinRaw('Opportunity')
          .where('Opportunity_fk', params.id)
      }
      if (params.searchStr) {
        // console.log('1');
        let page = params.page || 1;
        let perPage = params.perPage || 10;
        const pageInt = parseInt(page);
        let perPageInt = parseInt(perPage);
        if (perPageInt === -1) perPageInt = 100000000000000000;
        let total = 0;
        if ( pageInt === 1 ) page = 0;
        const offset = pageInt * perPageInt - perPageInt;
        const str = `%${params.searchStr}%`;
        const queryTotal = await request.Knex(request.Table).where(function() {
          this.where('Type','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('BPID','like', str)
            .orWhere('ContactPerson','like', str)
            .orWhere('FollowUpMeeting','like', str)
            .orWhere('Likelihood','like', str)
            .orWhere('Note','like', str)
        })
        const qry = await request.Knex(request.Table).where(function() {
          this.where('Type','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('BPID','like', str)
            .orWhere('ContactPerson','like', str)
            .orWhere('FollowUpMeeting','like', str)
            .orWhere('Likelihood','like', str)
            .orWhere('Note','like', str)
        }).limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      }
      if (!params.searchStr && !params.email && !params.id) {
        // console.log('4-act');
        let page = params.page || 1;
        let perPage = params.perPage || 10;
        const pageInt = parseInt(page);
        let perPageInt = parseInt(perPage);
        if (perPageInt === -1) perPageInt = 100000000000000000;
        let total = await request.Knex.select('*').from(request.Table);
        if (!params.page) {
          return total;
        }
        total = total.length;
        if ( pageInt === 1 ) page = 0;
        const offset = pageInt * perPageInt - perPageInt;
        const qry = await request.Knex.select('*')
          .from(request.Table)
          .distinct('CustomerName', 'Type')
          .orderBy('ActivityDate', 'desc')
          .limit(perPageInt)
          .offset(offset);
        query = {
          totalOpts: total,
          opts: qry
        }
      }
      return query;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Render a form to be used for creating a new activity.
   * GET activities/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new activity.
   * POST activities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { data } = request.all();
    if (data.CreationDate) delete data.CreationDate;
    try {
      // await request.Knex.table(request.Table).insert(data);
      await Activity.create(data)
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Display a single activity.
   * GET activities/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing activity.
   * GET activities/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update activity details.
   * PUT or PATCH activities/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const { id, data } = request.all();
    if (data.updated_at) delete data.updated_at;
    // console.log(data.Id, data);
    // await request.Knex.select('*').from(request.Table).where({ id: id }).update(data)
    await Activity.query().where('id', id).update(data);
  }

  /**
   * Delete a activity with id.
   * DELETE activities/:id
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

module.exports = ActivityController

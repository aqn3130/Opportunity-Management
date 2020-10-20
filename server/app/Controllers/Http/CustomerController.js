'use strict'
const Database = use('Database');
const Customer = use('App/Models/Customer')
const Activity = use('App/Models/Activity')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with customers
 */
class CustomerController {
  /**
   * Show a list of all customers.
   * GET customers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const params = request.all()
    let query = undefined;
    if (params.id) {
      // console.log('-1');
      query = await request.Knex.select('*')
        .from('activities')
        .joinRaw('customers')
        .where('customer_id', params.id)
        .orderBy('id', 'DESC')
    }
    else if (params.with === 'activities' && !params.searchStr) {
      let page = params.page || 1;
      let perPage = params.perPage || 10;
      const pageInt = parseInt(page);
      let perPageInt = parseInt(perPage);
      if (perPageInt === -1) perPageInt = 100000000000000000;
      let total = 0;
      if ( pageInt === 1 ) page = 0;
      const offset = pageInt * perPageInt - perPageInt;
      const str = `%${params.searchStr}%`;
      const queryTotal = await request.Knex(request.Table)
        .join('activities', 'customers.id', '=', 'activities.customer_id')
        .select('*')
      // const qry = await request.Knex(request.Table)
      const qry = await request.Knex(request.Table)
        .join('activities', 'customers.id', '=', 'activities.customer_id').orderBy('activities.id','DESC')
        // .select('*')
        // .limit(perPageInt).offset(offset)

      const customers = await request.Knex(request.Table);
      total = queryTotal.length;
      query = {
        totalOpts: total,
        opts: qry,
        customers: customers
      }
    }
    else if (params.searchStr) {
      // console.log('searched')
      let page = params.page || 1;
      let perPage = params.perPage || 10;
      const pageInt = parseInt(page);
      let perPageInt = parseInt(perPage);
      if (perPageInt === -1) perPageInt = 100000000000000000;
      let total = 0;
      if ( pageInt === 1 ) page = 0;
      const offset = pageInt * perPageInt - perPageInt;
      const str = `%${params.searchStr}%`;
      const queryTotal = await request.Knex(request.Table)
        .join('activities', 'customers.id', '=', 'activities.customer_id')
        .select('*')

      // const qry = await request.Knex(request.Table)
      //   .join('activities', 'customers.id', '=', 'activities.customer_id').orderBy('activities.id','DESC')
      //   .select('*')

      // .limit(perPageInt).offset(offset)

      const qry = await request.Knex.select('*').from(request.Table).join('activities', function() {
        this.on(function() {
          this.on('customers.id', '=', 'activities.customer_id')
        })
      })
        .where(function() {
          this.where('activities.CustomerName','like', str)
            .orWhere('activities.Type', 'like', str)
            .orWhere('activities.BPID','like', str)
            .orWhere('activities.FollowUpMeeting','like', str)
            .orWhere('activities.Likelihood','like', str)
            .orWhere('activities.Note','like', str)
            .orWhere('activities.ActivityDate','like', str)
        })

      const customers = await request.Knex(request.Table);
      total = queryTotal.length;
      query = {
        totalOpts: total,
        opts: qry,
        customers: customers
      }
    }
    else {
      query = await request.Knex(request.Table)
    }
    return query;
  }

  /**
   * Render a form to be used for creating a new customer.
   * GET customers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new customer.
   * POST customers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single customer.
   * GET customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing customer.
   * GET customers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update customer details.
   * PUT or PATCH customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a customer with id.
   * DELETE customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CustomerController

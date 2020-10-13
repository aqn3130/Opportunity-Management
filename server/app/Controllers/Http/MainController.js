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
        // console.log('-1');
        query = await request.Knex.select('*')
          .from('Product')
          .joinRaw('Opportunity')
          .where('Opportunity_fk', params.id)
      }
      if (params.email) {
        // console.log('0');
        query = await request.Knex.select('*')
          .from(request.Table)
          .where('Email', params.email)
      }
      if (params.searchStr && !params.filter) {
        console.log('1');
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
            .orWhere('SalesRep', 'like', str)
            .orWhere('OpportunityName','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('Country','like', str)
            .orWhere('ChannelType','like', str)
            .orWhere('IndustryType','like', str)
            .orWhere('Origin','like', str)
            .orWhere('SalesStage','like', str)
            .orWhere('GrossValue','like', str)
            .orWhere('BPID','like', str)
            .orWhere('MemberOfConsortia','like', str)
        })
        const qry = await request.Knex(request.Table).where(function() {
          this.where('Type','like', str)
            .orWhere('SalesRep', 'like', str)
            .orWhere('OpportunityName','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('Country','like', str)
            .orWhere('ChannelType','like', str)
            .orWhere('IndustryType','like', str)
            .orWhere('Origin','like', str)
            .orWhere('SalesStage','like', str)
            .orWhere('GrossValue','like', str)
            .orWhere('BPID','like', str)
            .orWhere('MemberOfConsortia','like', str)
        }).limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      }
      if (params.filter && !params.searchStr) {
        // console.log('2');
        let page = params.page || 1;
        let perPage = params.perPage || 10;
        const pageInt = parseInt(page);
        let perPageInt = parseInt(perPage);
        if (perPageInt === -1) perPageInt = 100000000000000000;
        let total = 0;
        if ( pageInt === 1 ) page = 0;
        const offset = pageInt * perPageInt - perPageInt;
        const queryTotal = await request.Knex(request.Table).where('Status', params.filter)
        const qry = await request.Knex(request.Table).where('Status', params.filter).limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      }
      if (params.filter && params.searchStr) {
        // console.log('3');
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
            .orWhere('SalesRep', 'like', str)
            .orWhere('OpportunityName','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('Country','like', str)
            .orWhere('ChannelType','like', str)
            .orWhere('IndustryType','like', str)
            .orWhere('Origin','like', str)
            .orWhere('SalesStage','like', str)
            .orWhere('GrossValue','like', str)
            .orWhere('BPID','like', str)
            .orWhere('MemberOfConsortia','like', str)
        }).andWhere('Status', params.filter)
        const qry = await request.Knex(request.Table).where(function() {
          this.where('Type','like', str)
            .orWhere('SalesRep', 'like', str)
            .orWhere('OpportunityName','like', str)
            .orWhere('CustomerName','like', str)
            .orWhere('Country','like', str)
            .orWhere('ChannelType','like', str)
            .orWhere('IndustryType','like', str)
            .orWhere('Origin','like', str)
            .orWhere('SalesStage','like', str)
            .orWhere('GrossValue','like', str)
            .orWhere('BPID','like', str)
            .orWhere('MemberOfConsortia','like', str)
        }).andWhere('Status', params.filter)
          .limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      }
      if (!params.filter && !params.searchStr && !params.email && !params.id) {
        // console.log('4');
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
        const qry = await request.Knex.select('*').from(request.Table).limit(perPageInt).offset(offset);
        // console.log(page, offset);
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

  async getSingleOpp({ request, response }) {
    const params = request.all();
    let query = undefined;
    if (params.opportunityId) {
      // console.log('getSingle');
      query = await request.Knex('Opportunity')
        .where('id', params.opportunityId)
    }
    // console.log(query);
    return query
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
    if (request.Table === 'Product') delete data.CreationDate;
    try {
      return await request.Knex.table(request.Table).insert(data);
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
    if (request.Table === 'Product') delete data.updated_at;
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

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const env = use('Env');
const axios = require('axios');

/**
 * Resourceful controller for interacting with notes
 */
class NoteController {
  /**
   * Show a list of all notes.
   * GET notes
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
          .from('Note')
          .joinRaw('Opportunity')
          .where('Opportunity_fk', params.id)
      }
      return query;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Render a form to be used for creating a new note.
   * GET notes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new note.
   * POST notes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { data } = request.all();
    delete data.CreationDate;
    try {
      await request.Knex.table(request.Table).insert(data);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Display a single note.
   * GET notes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing note.
   * GET notes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update note details.
   * PUT or PATCH notes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const { data } = request.all();
    delete data.updated_at;
    // console.log(data.Id, data);
    await request.Knex.select('*').from(request.Table).where({ id: data.Id }).update(data)
  }

  /**
   * Delete a note with id.
   * DELETE notes/:id
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

module.exports = NoteController

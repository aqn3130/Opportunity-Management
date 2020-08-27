'use strict';
const mysql = require("mysql");
// const mysql = use('mysql');
const Env = use('Env');
const pool = undefined;
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class DbConnection {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  getDBConnection() {
    return require('knex')({
      client: 'mysql',
      connection: {
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USER'),
        password: Env.get('DB_PASSWORD'),
        database: Env.get('DB_DATABASE'),
        acquireConnectionTimeout: 120000
      }
    });
  }

   async getAppMakerDBConnection() {
   return require('knex')({
      client: 'mysql',
      connection: {
        host: Env.get('DB_APPMAKER_HOST'),
        user: Env.get('DB_APPMAKER_USER'),
        password: Env.get('DB_APPMAKER_PASSWORD'),
        database: Env.get('DB_APPMAKER_DATABASE'),
        acquireConnectionTimeout: 60000
      },
     pool: {
       min: 0, max: 7
     }
    });
  }

  async handle ({ request }, next) {
    let table = undefined;
    let knex = undefined;
    if ( request.request.method === 'DELETE'){
      table = request.url().replace(/\//g, ',').split(',')[2];
    }else {
      table = request.url().substring(request.url().lastIndexOf('/') + 1);
    }

    knex = await this.getDBConnection();
    const Table = () => knex(table);
    request.Table = Table();
    await next()
  }
}

module.exports = DbConnection

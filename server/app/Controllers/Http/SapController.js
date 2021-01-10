'use strict'

const {rule} = require("@adonisjs/validator/src/Validator");
const { validateAll } = use('Validator');
const { validations } = require('indicative/validator');

class SapController {
  async getSAPSourced({ request, response }) {
    let query = undefined;
    const params = request.all();
    let page = params.page || '1';
    let perPage = params.perPage || '10';
    const pageInt = parseInt(page);
    let perPageInt = parseInt(perPage);
    if (perPageInt === -1) perPageInt = 100000000000000000;
    let total = 0;
    if ( pageInt === 1 ) page = 0;
    const offset = pageInt * perPageInt - perPageInt;

    if (params.searchStr && !params.filter) {
      const str = `%${params.searchStr}%`;
      const queryTotal = await request.Knex('Opportunity').where(function() {
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
      }).andWhere('source', 'SAP')
      const qry = await request.Knex('Opportunity').where(function() {
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
      }).andWhere('source', 'SAP')
        .limit(perPageInt).offset(offset)
      total = queryTotal.length;
      query = {
        totalOpts: total,
        opts: qry
      }
    }
    if (params.filter && !params.searchStr) {
      const values = params.filter.split(',');
      try {
        const queryTotal = await request.Knex('Opportunity')
          .where('source', 'SAP')
          .whereIn('Status', values)
        const qry = await request.Knex('Opportunity')
          .where('source', 'SAP')
          .whereIn('Status', values)
          .limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (params.filter && params.searchStr) {
      const str = `%${params.searchStr}%`;
      const statuses = params.filter.split(',');
      const queryTotal = await request.Knex('Opportunity').where(function() {
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
      }).whereIn('Status', statuses)
        .andWhere('source', 'SAP')
      const qry = await request.Knex('Opportunity').where(function() {
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
      }).whereIn('Status', statuses)
        .andWhere('source', 'SAP')
        .limit(perPageInt).offset(offset)
      total = queryTotal.length;
      query = {
        totalOpts: total,
        opts: qry
      }
    }
    if (!params.filter && !params.searchStr) {
      try {
        const queryTotal = await request.Knex('Opportunity').where('source', 'SAP');
        const qry = await request.Knex('Opportunity').where('source', 'SAP')
          .limit(perPageInt).offset(offset)
        total = queryTotal.length;
        query = {
          totalOpts: total,
          opts: qry
        }
      } catch (e) {
        console.log(e);
      }
    }
    return query;
  }
  async store ({ request, response }) {
    const { data } = request.all();
    const currency = ['EUR', 'USD', 'GBP', 'JPY', 'AUD'];
    const dateRule = {
      validDate: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])]
    }
    const rules = {
      SalesRep: 'required',
      Type: 'required|in:SPS,ISM',
      OpportunityName: 'required',
      CustomerName: 'required',
      ChannelType: 'required|in:Academic,Corporate,Government',
      Currency: 'required'
    }
    for (let i = 0; i < data.length; i += 1) {
      const validation = await validateAll(data[i], rules);
      if(validation.fails()) {
        response.status(400).send(validation.messages());
        return;
      }
    }

    try {
      for (let i = 0; i < data.length; i += 1) {
        data[i].CreationDate = new Date().toISOString().substr(0, 18);
        data[i].OpportunityStartDate = new Date().toISOString().substr(0, 18);
        data[i].ExpectedCloseDate = new Date(new Date().getFullYear(), 11, 31).toISOString().substr(0, 18);
        data[i].Origin = 'Marketing';
        data[i].SalesStage = '1 - Prospect / Lead';
        data[i].Status = 'In Process';
        data[i].source = 'SAP';
        if (!currency.includes(data[i].Currency)) delete data[i].Currency;
      }

      const created_ids = [];
      for ( let j = 0; j < data.length; j += 1) {
        const res = await request.Knex
          .insert(data[j]).into('Opportunity');
        created_ids.push(res[0]);
      }

      const created_opp = [];
      for ( let k = 0; k < created_ids.length; k += 1) {
        const res = await request.Knex('Opportunity').where('id', created_ids[k])
          .select('id', 'SalesRep', 'OpportunityName', 'CustomerName', 'BPID', 'Type');
        created_opp.push(res);
      }
      // console.log(created_opp);
      response.status(201).send(created_opp);
    } catch (e) {
      console.log(e);
      if (e.sqlMessage) response.status(400).send(e.sqlMessage);
      else response.status(400).send(e);
    }
  }
}

module.exports = SapController

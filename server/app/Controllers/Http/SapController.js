'use strict'

const {rule} = require("@adonisjs/validator/src/Validator");
const { validateAll } = use('Validator');
const { validations } = require('indicative/validator');
const currency = ['EUR', 'USD', 'GBP', 'JPY', 'AUD'];
const dateRule = {
  validDate: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])]
}
const rules = {
  SalesRep: 'required',
  Email: 'required|email',
  OpportunityName: 'required',
  CustomerName: 'required',
  ChannelType: 'required|in:Academic,Corporate,Government',
  Currency: 'required'
}

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

    for (let i = 0; i < data.length; i += 1) {
      const validation = await validateAll(data[i], rules);
      if(validation.fails()) {
        const validationError = {
          Error: validation.messages()
        }
        response.status(400).send(validationError);
        return;
      }
    }

    try {
      for (let i = 0; i < data.length; i += 1) {
        const salesRep = await this.getSalesRep(data[i].Email, request);
        let country = null;
        let countryRes = undefined;
        if (data[i].Country) countryRes = await this.getCountry(data[i].Country, request);
        if (countryRes) country = countryRes;
        if (!salesRep) {
          const validationError = {
            "Error": [
              {
                "message": "Email does not match a Sales-Rep account",
                "field": "Email",
                "validation": "required"
              }
            ]
          }
          response.status(400).send(validationError);
          return;
        }
        if (!currency.includes(data[i].Currency)) delete data[i].Currency;
        data[i].CreationDate = new Date().toISOString().substr(0, 18);
        data[i].OpportunityStartDate = new Date().toISOString().substr(0, 10);
        data[i].ExpectedCloseDate = new Date(new Date().getFullYear(), 11, 31).toISOString().substr(0, 10);
        data[i].Origin = 'Marketing';
        data[i].SalesStage = '1 - Prospect / Lead';
        data[i].Status = 'In Process';
        data[i].source = 'SAP';
        data[i].SalesRep = salesRep[0].Full_Name;
        data[i].Type = salesRep[0].Type;
        data[i].Country = country;
        data[i].ForecastCategory = 'Pipeline';
        data[i].OpportunityName = `Lead Gen: ${data[i].OpportunityName}`;
        delete data[i].Email;
      }

      const created_ids = await this.addNotes(data, request);

      const resData = await this.getResponse(created_ids, request);
      response.status(201).send(resData);
    } catch (e) {
      console.log(e);
      const error = {
        "Error": [
          {
            "message": "Something went wrong, please contact system administrator"
          }
        ]
      }
      if (e.sqlMessage) {
        error.Error[0].message = e.sqlMessage
      }
      response.status(400).send(error);
    }
  }

  async getSalesRep(email, request) {
    const user = await request.Knex('SalesRep').where('Email', email);
    let salesRep = undefined;
    if (user.length) {
      const res = await request.Knex('SalesRep').where('Email', email).select('Full_Name', 'Type');
      if (res.length) salesRep = res;
    } else {
      let fullName = email.substring(0, email.indexOf('@')).toLowerCase();
      const res = await request.Knex('SalesRep').where('Full_Name', fullName).select('Full_Name', 'Type');
      if (res.length) salesRep = res;
    }
    return salesRep;
  }

  async getResponse(created_ids, request) {
    const created_opp = [];
    for (let k = 0; k < created_ids.length; k += 1) {
      const res = await request.Knex('Opportunity').where('id', created_ids[k])
        .select('id', 'SalesRep', 'OpportunityName', 'CustomerName', 'BPID', 'Type');
      created_opp.push(res);
    }
    // console.log(created_opp);
    const resData = {
      Successful: created_opp
    }
    return resData;
  }

  async addNotes(data, request) {
    const created_ids = [];

    for (let j = 0; j < data.length; j += 1) {
      let notes = undefined;

      if (data[j].Notes && data[j].Notes.length > 0) {
        notes = data[j].Notes;
      }

      if (data[j].Notes) delete data[j].Notes;

      const res = await request.Knex.insert(data[j]).into('Opportunity');

      if (notes && notes.length > 0) {
        for (let n = 0; n < notes.length; n += 1) {
          const data = {};
          data.Message = notes[n].note;
          data.Opportunity_fk = res;
          data.CreateDate = new Date().toISOString().substring(0, 18);
          await request.Knex('Note').insert(data);
        }
      }

      created_ids.push(res[0]);
    }
    return created_ids;
  }

  async getCountry(countryCode, request) {
    let country = undefined;
    const crt = await request.Knex('Country_Region_Territory').where('CRMCountryCode', countryCode);
    if (crt.length) {
      country = crt[0].Country;
    }
    // console.log(country);
    return country;
  }
}

module.exports = SapController

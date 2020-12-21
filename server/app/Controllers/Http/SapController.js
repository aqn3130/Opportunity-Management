'use strict'

const {rule} = require("@adonisjs/validator/src/Validator");
const { validateAll } = use('Validator');
const { validations } = require('indicative/validator');

class SapController {
  async store ({ request, response }) {
    const { data } = request.all();
    let dataValid = true;
    // console.log(data);
    const dateRule = {
      validDate: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])]
    }
    const rules = {
      SalesRep: 'required',
      // Type: 'required|in:SPS,ISM',
      OpportunityName: 'required',
      CustomerName: 'required',
      ChannelType: 'required|in:Academic,Corporate,Government',
      Origin: 'required|in:Marketing,Sales Originated,Renewal',
      OpportunityStartDate: [
        rule('required'),
        rule('date'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      Status: 'required|in:In Process,Won,Closed Won,Closed Lost',
      SalesStage: 'required|in:1 - Prospect / Lead,2 - Pre-Qualification,3 - Qualified,4 - Needs Assessment,5 - Product Evaluation,6 - Proposal Sent,7 - Negotiating Commercial,8 - Negotiating LC/Legal,9 - Final Terms Accepted,10 - License Delivered to Customer',
      ExpectedCloseDate: [
        rule('required'),
        rule('date'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      Currency: 'required|in:EUR,USD,GBP,JPY,AUD',
    }
    for (let i = 0; i < data.length; i += 1) {
      const validation = await validateAll(data[i], rules);
      if(validation.fails()) {
        // return validation.messages();
        response.status(400).send(validation.messages());
        return;
      }
    }

    async function getSalesRepType(email) {
      const user = await request.Knex('SalesRep').where('Email', email);
      let type = null;
      if (user.length) {
        type = await request.Knex('SalesRep').where('Email', email).select('Type');
        if (type.length) type = type[0].Type;
      } else {
        let fullName = email.substring(0, email.indexOf('@')).toLowerCase();
        type = await request.Knex('SalesRep').where('Full_Name', fullName).select('Type');
        if (type.length) type = type[0].Type;
      }

      if (type !== 'SPS' && type !== 'ISM') {
        dataValid = false;
      }
      return type;
    }

    try {
      for (let i = 0; i < data.length; i += 1) {
        data[i].CreationDate = new Date().toISOString().substr(0, 18);
        const type = await getSalesRepType(data[i].email);
        if (type) data[i].Type = type;
        delete data[i].email;
      }

      if (!dataValid) {
        response.status(400).send('Sales Rep not found');
        return;
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
      response.send(e);
    }
  }
}

module.exports = SapController

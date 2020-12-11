'use strict'

const {rule} = require("@adonisjs/validator/src/Validator");
const { validateAll } = use('Validator')
const { validations } = require('indicative/validator')

class SapController {
  async store ({ request, response }) {
    const { data } = request.all();
    // console.log(data);
    const dateRule = {
      validDate: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])]
    }
    const rules = {
      SalesRep: 'required',
      Type: 'required|in:SPS,ISM',
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
    const validation = await validateAll(data, rules);
    if(validation.fails()) {
      return validation.messages();
    }
    try {
      data.CreationDate = new Date().toISOString().substr(0, 18);
      return await request.Knex('Opportunity').insert(data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = SapController

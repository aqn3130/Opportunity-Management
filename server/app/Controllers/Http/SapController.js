'use strict'

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
      SalesRep: 'required|alpha_numeric',
      Type: 'required|in:SPS,ISM',
      OpportunityName: 'required',
      CustomerName: 'required',
      ChannelType: 'required',
      Origin: 'required',
      OpportunityStartDate: 'required',
      Status: 'required',
      SalesStage: 'required',
      ExpectedCloseDate: 'required',
      Currency: 'required',
    }
    const validation = await validateAll(data, rules);
    if(validation.fails()) {
      return validation.messages();
    }
    try {
      return await request.Knex('Opportunity').insert(data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = SapController

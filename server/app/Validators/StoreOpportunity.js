'use strict'

class StoreOpportunity {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      SalesRep: 'required',
      Type: 'required',
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
  }
  get messages () {
    return {
      // 'SalesRep.alpha_numeric': 'You must provide an alpha_numeric value',
      'SalesRep.required': 'You must provide a valid SalesRep value.',
      'Type.required': 'You must provide a valid Type value.',
      // 'SalesRep.unique': 'This SalesRep is already registered.'
    }
  }
}

module.exports = StoreOpportunity

angular
  .module('app.totalprice.calculator')
  .constant('owrtOptions', [
    {id: 'RT', label: 'Roundtrip', selected:true},
    {id: 'OW', label: 'Oneway'}
  ])
  .constant('amountOptions', [
    {name: 'Total Price', value: 'totalAmt'},
    {name: 'Base Price', value: 'baseAmt'},
    {name: 'Surcharge', value: 'surChgAmt'},
    {name: 'YQYR', value: 'yqyrAmt'},
    {name: 'Taxes', value: 'taxAmt'}
  ])
  .constant('nrOptions', [
    {name: 'Select NR', value: ''},
    {name: 'NR', value: 'NR'},
    {name: 'RF', value: 'RF'}
  ])
  .constant('equalsNotEquals', [
    {name: '(=)', value: 'equal'},
    {name: '(!=)', value: 'notEqual'}
  ])
  .constant('stacked', [
    {id: 'Stacked', label: 'Stacked',selected: true},
    {id: 'Bar', label: 'Bar'}
  ])
  .constant('graphOptions', {amountOptions:[
    {name: 'Total Without Tax', value: 'totalWOTaxAmt',selected: true},
    {name: 'Total Price', value: 'totalAmt',selected: false},
    {name: 'Base Price', value: 'baseAmt',selected: false},
    {name: 'Surcharge', value: 'surChgAmt',selected: false},
    {name: 'YQYR', value: 'yqyrAmt',selected: false},
    {name: 'Taxes', value: 'taxAmt',selected: false}
  ],cabinOptions:[
    {id: "Economy", label: "Economy", cab: 'C',selected: true},
    {id: "PremiumEconomy", label: "Premium Economy", cab: 'B',selected: false},
    {id: "Business", label: "Business", cab: 'D',selected: false},
    {id: "First", label: "First Class", cab: 'E',selected: false}
  ],opOptions:[
    {id: 'Average', label: 'Average',selected: true},
    {id: 'Lowest', label: 'Lowest',selected: false},
    {id: 'Highest', label: 'Highest',selected: false}
  ]})
  .constant('marketGraphOptions', {amountOptions:[
    {name: 'Total Without Tax', value: 'totalWOTaxAmt',selected: true},
    {name: 'Total Price', value: 'totalAmt',selected: false},
    {name: 'Base Price', value: 'baseAmt',selected: false},
    {name: 'Surcharge', value: 'surChgAmt',selected: false},
    {name: 'YQYR', value: 'yqyrAmt',selected: false},
    {name: 'Taxes', value: 'taxAmt',selected: false}
  ],cabinOptions:[
    {id: "Economy", label: "Economy", cab: 'C',selected: true},
    {id: "PremiumEconomy", label: "Premium Economy", cab: 'B',selected: false},
    {id: "Business", label: "Business", cab: 'D',selected: false},
    {id: "First", label: "First Class", cab: 'E',selected: false}
  ],opOptions:[
    {id: 'Average', label: 'Average',selected: true},
    {id: 'Lowest', label: 'Lowest',selected: false},
    {id: 'Highest', label: 'Highest',selected: false}
  ]})
  .constant('downloadHeader',[
    'Day','Origin','Destination','CarrierCode','CurrencyCd','CabinType','BaseAmt','YQYRAmt','SurChgAmt',
    'TaxAmt','BaseWithSurChg','TotalAmt','OutboundFareClass','InboundFareClass','BookingCds','LastSaleDt','LastTravelDt',
    'RtFare','NoOfStops','ConnectionType','ConFares','PvtFares','CreationDate','CreationTime','DiscontinueDt','PricingAlgorithm',
    'LinkNo','SeqNo','InRoute','OutRoute','InDate','OutDate','Decimals','FbrInd'
  ])
  .constant('downloadOrder',[
    'day','origin','destination','carrierCode','currencyCd','cabinType','baseAmt','yqyrAmt','surChgAmt',
    'taxAmt','baseWithSurChg','totalAmt','outboundFareClass','inboundFareClass','bookingCds','lastSaleDt','lastTravelDt',
    'rtFare','noOfStops','connectionType','conFares','pvtFares','creationDate','creationTime','discontinueDate','pricingAlgorithm',
    'linkNo','seqNo','inRoute','outRoute','inDate','outDate','decimals','fbrInd'
  ])
  .constant('graphDefaults', {
    gMin:10000000000,
    gMax:0,
    startDate:0,
    endDate: 24 * 3600 * 1000 * 180
    });

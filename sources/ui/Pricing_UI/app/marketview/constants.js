angular
.module('app.marketview')
.constant('productTypeOptionList', [
  {name: 'Public Specified', value: 'PUB'},
  {name: 'Private Specified', value: 'PVT'},
  {name: 'Public Constructed', value: 'CNP'},
  {name: 'Private Constructed', value: 'CNV'},
  {name: 'Public Fare BY Rule', value: 'FBP'},
  {name: 'Private Fare By Rule', value: 'FBV'}
]);


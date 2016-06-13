'use strict';
(function() {
  angular.module('app').config(function (xtFormConfigProvider) {
    // Add custom validation strategy
    xtFormConfigProvider.addValidationStrategy('customStrategy', function (form, ngModel) {
      if (ngModel.$name != undefined && (ngModel.$name.indexOf('Date') !== -1)) {
        return ngModel.$invalid && (ngModel.$focused);
      }
      else if (ngModel.$name != undefined && (ngModel.$name.indexOf('acct') !== -1)) {
        return ngModel.$invalid
      }
      else {
        return ngModel.$invalid && (ngModel.$focused && (ngModel.$dirty || form.$submitted));
      }
    });

    xtFormConfigProvider.setErrorMessages({
      dtGreaterThanEff: 'Must be greater than or equal to Effective Date',
      dtGreaterThan: 'Must be greater than or equal to {{myMsg}}',
      dtLessThan: 'Must be Less than or equal to {{myMsg}}',
      pattern: 'Date must be in DDMMMYY format',
      invalidDate: "Date is not valid",
      required: '{{name}} is required',
      carrReq: 'Carrier is required when more than one Origin or Destination has been entered',
      acctRequired: 'Account code required if Product type is FBP or FBR'
    });
  });
})();


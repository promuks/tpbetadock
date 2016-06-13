'use strict';
(function() {
    angular.module('app.marketview').factory('MarketviewRequest', MarketviewRequest); 

    	MarketviewRequest.$inject = ['MarketviewCriteria', '$filter','productTypeOptionList'];

    	
    	  function MarketviewRequest(MarketviewCriteria, $filter,productTypeOptionList) {
    	  
    		  var marketviewRequest = {
    		      inEffectOn:      $filter('date')(new Date().toISOString().substring(0, 10), 'ddMMMyy'),
    		      productTypeList: productTypeOptionList[0],
    		      mktSubRequests: []
    		    };
    		   marketviewRequest.mktSubRequests.push(new MarketviewCriteria('WAS','LON','AA','FARE'));

    		    return marketviewRequest;

    		  }
    		})();
    	
    /*	
    	
       
        function MarketviewRequest(inEffectOn, time, travelDateBefore, travelDateAfter, saleDateBefore, saleDateAfter) {
            // Public properties, assigned to the instance ('this')
            this.inEffectOn = inEffectOn;
            this.time = time;
            this.travelDateBefore = travelDateBefore;
            this.travelDateAfter = travelDateAfter;
            this.saleDateBefore = saleDateBefore;
            this.saleDateAfter = saleDateAfter;
        }

         MarketviewRequest.prototype.load = function () {
            this.inEffectOn = $filter('date')(new Date().toISOString().substring(0, 10), 'ddMMMyy');
            this.subRequests = [];
            var initialMarketviewCriteria= new MarketviewCriteria();
            initialMarketviewCriteria.load();
            this.subRequests.push(initialMarketviewCriteria);
        };


       
        return MarketviewRequest;
    }]);
})();
*/
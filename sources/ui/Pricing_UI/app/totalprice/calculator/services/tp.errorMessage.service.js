(function () {
  angular.module('app.totalprice.calculator').factory('TpcMessageService',TpcMessageService);

  TpcMessageService.$inject = ['$rootScope','TpcPleaseWaitService'];

  function TpcMessageService ($rootScope,TpcPleaseWaitService) {
    var warningMessages = [];
    var errorMessages = [];
    var accordion = {
      messageAccordion: {
        open: false
      }
    };
    var addInternalErrorMessage = addInternalErrorMessage;
    var resetMessages = resetMessages;
    var getAccordions = getAccordions;
    var getErrorMessages = getErrorMessages;

    var service = {
      addInternalErrorMessage: addInternalErrorMessage,
      resetMessages:resetMessages,
      getAccordions:getAccordions,
      getErrorMessages:getErrorMessages
    };
    return service;

    function addInternalErrorMessage() {
      accordion.messageAccordion.open = true;
      errorMessages.splice(0);
      errorMessages.push({"message":"Internal Server Error Has Occured, Please Try Again Later"});
    }

    function getAccordions(){
      return accordion;
    }

    function getErrorMessages(){
      return errorMessages;
    }

    function resetMessages(){
      accordion.messageAccordion.open = false;
      warningMessages.splice(0);
      errorMessages.splice(0);
    }
  }
})();

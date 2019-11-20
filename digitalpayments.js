    $(function() {
     function getUrlParameters() {
        var search = location.search.substring(1);
        if (search == "") {
          return {};
        }
        return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
     };
     
     const parameters = getUrlParameters();
     console.log(parameters);
      const apiBaseUrl = "https://testportalone.processonepayments.com/api/api/";
      $('#see-in-action').on("click", function(e) {
        e.preventDefault();
        createSessionAndOpenModalWindow();
      });

      function openModalWindow(sessionId) {
        var portalOne = $('#portalOneContainer');

        portalOne.portalOne()
          .on('portalOne.load', function() {
            console.log(new Date() + ' portalOne.load');
          })
          .on('portalOne.unload', function() {
            console.log(new Date() + ' portalOne.unload');
          })
          .on('portalOne.error', function(e, data) {
            console.error(new Date() + ' portalOne.error', data.Description, data.Details);
          })
          .on('portalOne.paymentComplete', function(e, data) {
            console.info(new Date() + ' portalOne.paymentComplete. Transaction id is ', data.transactionId);
          })
          .on('portalOne.paymentCanceled', function() {
            console.log(new Date() + ' portalOne.paymentCanceled');
          })
          .on('portalOne.saveComplete', function(e, data) {
            console.info(
              new Date() + ' portalOne.saveComplete');
          })
          .on('portalOne.saveCanceled', function() {
            console.info(
              new Date() + ' portalOne.saveCanceled');
          })

        portalOne.data('portalOne').makePayment({
          'paymentCategory': 'CreditCard',
          'feeContext': 'PaymentWithFee',
          'minAmountDue': '107.98',
          'accountBalance': '431.92',
          'billingZip': '95630',
          'billingAddressStreet': '602 Coolidge Dr., Folsom, CA',
          'policyHolderName': 'John Smith',
          'clientReferenceData1': '4450354958',
          'sessionId': sessionId,
          'operation':'makePayment'
        });
      };

      /*
      .../SessionKey/Create should be called from the server side.
      In order to protect your security, do not expose your PortalOne Authentication key to anyone.
      Ths function and authentication key are provided for demonstrational purposes only.
      */
      function createSessionAndOpenModalWindow() {
         return $.ajax({
        url: apiBaseUrl + 'Session/Create',
        data: {
          portalOneAuthenticationKey:"1F13A366-FFF4-4B93-952F-DC7C22B354DA"
       
        },
        dataType: 'json',
        method: 'GET',
    
          success: function(session) {
            if (session.ResponseCode === "Success") {
              openModalWindow(session.PortalOneSessionKey);
            } else {
              element.trigger('portalOne.error', {
                description: "The payment portal loading failed: Can't create session key"
              });
            }
          },
          fail: function(e) {
            element.trigger('portalOne.error', {
              description: 'The payment portal loading failed ' + e.statusText
            });
          }
        });
      }
    });

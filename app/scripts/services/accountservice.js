'use strict';
angular.module('chocoholicsApp')
  .service('accountService', function(ENV, $http, localStorageService) {
    const ENDPOINT = '/account/';
    return {
      getTaxes: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'taxes/' + ENV.vendorKey + '?user=' + ENV.owner, {
          headers: {
            'x-access-token': localStorageService.get('token')
          }
        });
      },

      getPincodes: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'pincodes/' + ENV.vendorKey);
      },

      getCategories: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'categories/' + ENV.vendorId);
      }
    };
  });

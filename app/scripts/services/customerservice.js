'use strict';

/**
 * @ngdoc service
 * @name chocoholicsApp.customerService
 * @description
 * # customerService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
  .factory('customerService', function (ENV, $http) {
    // Service logic
    // ...

    const ENDPOINT = '/check/'
    var route = '/customer'

    // Public API here
    return {
      checkUser: function (phone) {
        return $http.get(ENV.serverURL + route + ENDPOINT + ENV.vendorKey +'?phone=' + phone);
      }
    };
  });

'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.loginservice
 * @description
 * # loginservice
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('loginService', function($http ,$q ,ENV) {
        // Service logic
        // ...
        const ENDPOINT = '/customer/';
        var route = '/auth';
        // Public API here
        return {
            loginUser: function(user) {
                return $http.post(ENV.serverURL + route + ENDPOINT + 'login/' + ENV.vendorKey, { phone: user.phone , password: user.password , brand: user.brand, type: ENV.type} , brand: ENV.brand);
            }
        };
    });
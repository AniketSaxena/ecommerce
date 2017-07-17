'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.loginservice
 * @description
 * # loginservice
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('loginService', function($http ,$q ,ENV, localStorageService) {
        // Service logic
        // ...
        const ENDPOINT = '/customer/';
        var route = '/auth';
        // Public API here
        return {
            loginUser: function(user) {
                var deferred = $q.defer();
                $http.post(ENV.serverURL + route + ENDPOINT + 'login/' + ENV.vendorKey, { phone: user.phone , password: user.password , brand:  ENV.brand, type: ENV.type})
                .then(function(response){
                    console.log(response.data);
                    localStorageService.set('userId',response.data.customer.objectId);
                    localStorageService.set('token', response.data.token);
                    // $http.defaults.headers.common['x-access-token'] = response.data.token;
                    $http.defaults.headers.post['x-access-token'] = response.data.token;
                    $http.defaults.headers.put['x-access-token'] = response.data.token;
                    deferred.resolve(response);
                }).catch(function(error){
                    console.error(error);
                });
                return deferred.promise;


            }
        };
    });
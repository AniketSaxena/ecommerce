'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.customerService
 * @description
 * # customerService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('customerService', function(ENV, $http, $q, loginService, orderService) {
        // Service logic
        // ...
        var route = '/customer';
        // Public API here
        return {
            checkUser: function(phone) {
                return $http.get(ENV.serverURL + route + '/check/' + ENV.vendorKey + '?phone=' + phone);
            },
            registerUser: function(user) {
                var deferred = $q.defer();
                $http.post(ENV.serverURL + route + '/register/' + ENV.vendorKey, {
                        phone: user.phone,
                        password: user.password,
                        brand: ENV.brand,
                        email: user.email,
                        name: user.name
                    })
                    .then(function(response) {
                        console.log('reached login');
                        return loginService.loginUser(user);
                    })
                    .then(function(response) {
                        console.log('reached orderService');
                        return orderService.createOrder();
                    })
                    .then(function(response){
                       console.log(response.data);
                       deferred.resolve();
                    })
                    .catch(function(error) {
                        console.error(error);
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        };
    });
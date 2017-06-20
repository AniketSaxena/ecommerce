'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.customerService
 * @description
 * # customerService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('customerService', function(ENV, $http, $q, loginService, orderService, localStorageService) {
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
                    .then(function(response) {
                        console.log(response.data);
                        var info = {
                            orderId: localStorageService.get('id'),
                            userId: localStorageService.get('userId'),
                            style: ENV.style
                        }
                        return orderService.updateInfo(info)
                    })
                    .then(function(response){
                        console.log(response);
                        deferred.resolve();
                    })
                    .catch(function(error) {
                        console.error(error);
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
              
            // addAddress: function(newAddress , id){
            //     return $http.post(ENV.serverURL + route + '/addAddress/' + id , {
            //         flatBldgName: newAddress.flatBldgName,
            //         street: newAddress.street,
            //         landmark: newAddress.landmark,
            //         pincode: newAddress.pincode,
            //         city: newAddress.city,
            //         state: newAddress.state
            //     });
            // },

            // getAddress: function(id){
            //     return $http.get(ENV.serverURL + route + '/getAddress/' + id);
            // }
            
        };
    });
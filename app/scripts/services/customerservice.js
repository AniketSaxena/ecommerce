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
                        if (localStorageService.get('id')) {
                            return true;
                        } else {
                            return orderService.createOrder();
                        }
                    })
                    .then(function(response) {
                        //from here
                        var info = {
                            orderId: localStorageService.get('id'),
                            userId: localStorageService.get('userId'),
                            style: ENV.style
                        };
                        return orderService.updateInfo(info);
                        //till here
                    })
                    .then(function(response) {
                        console.log(response);
                        deferred.resolve();
                        $uibModalInstance.close();
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

            addAddress: function(newAddress, customerId) {
                console.log(newAddress);
                var deferred = $q.defer();
                var query = new Parse.Query('Customer');
                query.get(customerId).then(function(customer) {
                    var Address = new Parse.Object.extend('Address');
                    var address = new Address();
                    address.set('flatBldgName', newAddress.flatBldgName);
                    address.set('street', newAddress.street);
                    address.set('landmark', newAddress.landmark);
                    address.set('pincode', newAddress.pincode);
                    address.set('state', newAddress.state);
                    address.set('city', newAddress.city);
                    address.set('vendor', ENV.vendorKey);
                    address.save().then(function(address) {
                        var addressRelation = customer.relation('address');
                        addressRelation.add(address);
                        return customer.save();
                    }).then(function(customer) {
                        deferred.resolve(customer);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAddresses: function(customerId) {
                var deferred = $q.defer();
                var query = new Parse.Query('Customer');
                var addressList = [];
                query
                    .get(customerId)
                    .then(function(customer) {
                        var relation = customer.relation('address');
                        var relationQuery = relation.query();
                        relationQuery.equalTo('vendor', ENV.vendorKey);
                        return relationQuery.find();
                    }).then(function(addresses) {
                        angular.forEach(addresses, function(address) {
                            addressList.push({
                                id: address.id,
                                flatBldgName: address.get('flatBldgName'),
                                street: address.get('street'),
                                landmark: address.get('landmark'),
                                city: address.get('city'),
                                state: address.get('state'),
                                pincode: address.get('pincode')
                            });
                        });
                        deferred.resolve(addressList);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                return deferred.promise;
            },
            getAddress: function(id) {
                var deferred = $q.defer();
                var query = new Parse.Query('Address');
                query
                    .get(id)
                    .then(function(address) {
                        deferred.resolve({
                            id: address.id,
                            flatBldgName: address.get('flatBldgName'),
                            street: address.get('street'),
                            landmark: address.get('landmark'),
                            city: address.get('city'),
                            state: address.get('state'),
                            pincode: address.get('pincode')
                        });
                    }, function(error) {
                        deferred.resolve(error);
                    });
                return deferred.promise;
            },

        };
    });
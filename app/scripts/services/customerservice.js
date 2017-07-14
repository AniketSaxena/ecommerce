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
    var addressRoute = '/address';
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
            localStorageService.set('name', user.name);
            localStorageService.set('phone', user.phone);
            localStorageService.set('email', user.email);
            if (localStorageService.get('id')) {
              return true;
            } else {
              return orderService.createOrder();
            }
          })
          .then(function(response) {
            console.log(response);
            if (response === true) {
              var info = {
                orderId: localStorageService.get('id'),
                userId: localStorageService.get('userId'),
                style: ENV.style
              };
              return orderService.updateInfo(info);

            } else {
              return true;
            }
            //from here
            //till here
          })
          .then(function(response) {
            console.log(response);
            deferred.resolve();
          })
          .catch(function(error) {
            console.error(error);
            deferred.reject(error);
          });
        return deferred.promise;
      },

      addAddress: function(address, customerId) {
        return $http.post(ENV.serverURL + addressRoute + '/add/' + ENV.vendorKey, {
          newAddress: address,
          customerId: customerId
        });
      },
      updateAddress: function(newAddress, customerId) {
        return $http.put(ENV.serverURL + addressRoute + '/update/' + ENV.vendorKey, {
          address: newAddress,
          customerId: customerId
        });
      },
      getAddresses: function(customerId) {
        return $http.get(ENV.serverURL + addressRoute + '/all/' + ENV.vendorKey + '/' + customerId);
      },
      removeAddress: function(addressId) {
        return $http.delete(ENV.serverURL + addressRoute + '/delete/' + addressId);
      },
      // changePin: function(pincode) {
      //     var base = "http://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?format=json"
      //     var key = "&api-key=" + ENV.myGovAPI;
      //     var filter= "&filters[pincode]=" + pincode;
      //     return $http.get(base + key + filter);
      // }
    };
  });

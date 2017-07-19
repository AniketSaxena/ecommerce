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
    // 
    function newRegistration(user) {
      return $http.post(ENV.serverURL + route + '/register/' + ENV.vendorKey, {
        phone: user.phone,
        password: user.password,
        brand: ENV.brand,
        email: user.email,
        name: user.name
      });
    }

    function updateUser(user) {
      return $http.post(ENV.serverURL + route + '/update/' + ENV.vendorKey, {
        phone: user.phone,
        password: user.password,
        brand: ENV.brand,
        email: user.email,
        name: user.name
      });
    }

    return {
      checkUser: function(phone) {
        return $http.get(ENV.serverURL + route + '/check/' + ENV.vendorKey + '?phone=' + phone);
      },
      registerUser: function(user, code) {
        var deferred = $q.defer();
        var promises = [];

        console.info(code);

        if (code === 1001) {
          // Update the user profile
          promises.push(updateUser(user));
        }

        if (code === 668) {
          // register the user
          promises.push(newRegistration(user));
        }

        $q
          .all(promises)
          .then(function() {
            return loginService.loginUser(user);
          })
          .then(function() {
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

      updateProfile: function(id, password) {
        return $http.put(ENV.serverURL + route + '/updateProfile/' + ENV.vendorKey + '/' + id, { password: password, brand: ENV.brand }, { headers: { 'x-access-token': localStorageService.get('token') } });
      },

      addAddress: function(address, customerId) {
        return $http.post(ENV.serverURL + addressRoute + '/add/' + ENV.vendorKey, {
          newAddress: address,
          customerId: customerId
        });
      },
      updateAddress: function(addressId, newAddress) {
        return $http.put(ENV.serverURL + addressRoute + '/update/' + addressId, {
          newAddress: newAddress
        });
      },
      getAddresses: function(customerId) {
        return $http.get(ENV.serverURL + addressRoute + '/all/' + ENV.vendorKey + '/' + customerId, { headers: { 'x-access-token': localStorageService.get('token') } });
      },
      removeAddress: function(addressId) {
        return $http.delete(ENV.serverURL + addressRoute + '/delete/' + addressId);
      },
      createDummySession: function() {
        return $http.post(ENV.serverURL + '/auth/createSession', { id: 'dummy' });
      },
      changePin: function(pincode) {
        if (pincode && pincode.toString().length === 6) {
          var base = ENV.myGovURL + ENV.myGovAPI + '&filters[pincode]=' + pincode;
          return $http.get(base, { cache: false, 'cache-control': 'none', 'Access-Control-Allow-Origin': '*' });
        }
      },
      getEmail: function(phone) {
        return $http.get(ENV.serverURL + route + '/getdata/' + ENV.brand + '?phone=' + phone);
      }
    };
  });

'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('LoginmodalCtrl', function($q, $state, $uibModal, $uibModalInstance, $scope, $http, $rootScope, loginService, orderService, customerService, localStorageService, ENV) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var vm;
    vm = this;
    this.user = {};
    this.userId = localStorageService.get('userId');
    this.login = function() {
      loginService.loginUser(vm.user)
        .then(function(response) {
          console.log(response);
          localStorageService.set('userId', response.data.customer.objectId);
          vm.userId = localStorageService.get('userId');
          localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last || '');
          localStorageService.set('phone', response.data.customer.phone);
          localStorageService.set('email', response.data.email);
          return vm.getUserOrders();
        })
        .then(function(orderId) { // This response will be either an order Id or null
          console.log(orderId);
          if (orderId) {
            // If this order id is not null, then compare with the one in localstorage
            if (localStorageService.get('id') && orderId === localStorageService.get('id')) {
              return true;
              // if same, then do nothing
            } else {
              localStorageService.set('id', orderId);
              return true;
              // Replace the id in the LS if this is different from the one stored there
            }
          } else {
            // Else if this order id is null, then create a new order and proceed as before
            if (localStorageService.get('id')) {
              //If id exits in LS link user to that order id
              return true;
            } else {
              //else if id does not create and order and use that id
              return orderService.createOrder();
            }
          }

        })
        .then(function(response) {
          if (typeof(response) === 'boolean') {
            if (response.data && response.data.objectId) {
              localStorageService.set('id', response.data.objectId);
            }
          } else {}
          $uibModalInstance.close('User Logged In');
          var info = {
            orderId: localStorageService.get('id'),
            userId: localStorageService.get('userId'),
            style: ENV.style
          };
          console.log(info);
          return orderService.updateInfo(info);
        })
        .then(function(response) {
          console.log(response);
          console.log(response.data);
          $uibModalInstance.close();
          $state.reload();
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          vm.error = error;
          console.error(error);
        });
    };
    this.checkUser = function() {
      if (vm.user.phone.length === 10) {
        customerService.checkUser(vm.user.phone)
          .then(function(response) {
            console.log(response);
            console.log(response.data.code);
            if (response.data.code === 668 || response.data.code === 1001) {
              $uibModalInstance.dismiss();
              vm.register(vm.user.phone, response.data.code);
            }
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error });
            console.error(error);
          });
      }
    };
    this.register = function(phone, code) {
      $uibModal.open({
        templateUrl: '/views/registermodal.html',
        size: 'sm',
        controller: 'RegistermodalCtrl',
        ControllerAs: 'register',
        resolve: {
          phone: function() {
            return phone;
          },
          code: function(){
            return code;
          }
        }
      });
    };
    this.cancel = function() {
      $uibModalInstance.close('cancel');
    };
    this.getUserOrders = function() {
      var deferred = $q.defer();
      console.log(vm.userId);
      orderService.getOrders(0, 1, vm.userId, 'createdAt', 'initiated') // Include the state param to make sure only initiated orders are retrieved
        .then(function(response) {
          console.log(response.data);
          // The response is from the server, it can have two possible responses
          if (response.data && response.data.length) {
            // Resolve the final value of the order id and return the promise
            deferred.resolve(response.data[0].id);
          } else {
            // Else (if the response has an empty array, which means for this user no orders exist on the server)
            // resolve null
            deferred.resolve(null);
          }

        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.error(error);
          deferred.reject(error.data);
        });
      return deferred.promise;
    };
  });

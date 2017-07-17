'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:RegistermodalCtrl
 * @description
 * # RegistermodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('RegistermodalCtrl', function($scope, $state, $uibModalInstance, phone, customerService, code, localStorageService) {
    $scope.user = {};
    if (phone) {
      $scope.user.phone = phone;
    }
    $scope.register = function() {
      localStorageService.remove('selectedAddress');
      customerService.registerUser($scope.user, code)
        .then(function() {
          $uibModalInstance.close();
          $state.reload();
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
          $uibModalInstance.dismiss();
        });
    };
  });

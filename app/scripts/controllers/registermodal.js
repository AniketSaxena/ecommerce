'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:RegistermodalCtrl
 * @description
 * # RegistermodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('RegistermodalCtrl', function($scope, $state, $uibModalInstance, phone, customerService) {
    $scope.user = {};
    if (phone) {
      $scope.user.phone = phone;
    }
    $scope.register = function() {
      customerService.registerUser($scope.user)
        .then(function() {
          $uibModalInstance.close();
          $state.reload();
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
          $uibModalInstance.dismiss();
        });
    };
  });

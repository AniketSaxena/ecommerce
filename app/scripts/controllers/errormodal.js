'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ErrormodalCtrl
 * @description
 * # ErrormodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ErrormodalCtrl', function($scope, error, title) {
    $scope.title = title || 'An error has occured';

    if (error && error.message) {
      $scope.errorMessage = error.message;
    }

    if (error && typeof error === 'string') {
      $scope.errorMessage = error;
    }
  });

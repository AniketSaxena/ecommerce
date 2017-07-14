'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ErrormodalCtrl
 * @description
 * # ErrormodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ErrormodalCtrl', function($scope, error) {
  	if(error && error.message){
    	$scope.errorMessage = error.message;
  	}
  });

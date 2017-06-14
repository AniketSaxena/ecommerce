'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:RegistermodalCtrl
 * @description
 * # RegistermodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('RegistermodalCtrl', function ($scope, $uibModalInstance, phone){
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    console.log('hello');
    $scope.user = {};


    if(phone){
      $scope.user.phone = phone;
    }

    
  });

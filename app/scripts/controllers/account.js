'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AccountCtrl', function (localStorageService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var name;
    var phone;
    var email;
    this.name = localStorageService.get('name');
    this.phone = localStorageService.get('phone');
    this.email = localStorageService.get('email');
  });

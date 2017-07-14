'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AsidectrlCtrl
 * @description
 * # AsidectrlCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AsideCtrl', function($uibModalInstance, $scope, $rootScope, localStorageService, isLoggedIn) {
    // to set as active
    $('#tab').click(function(e) {
      e.preventDefault();
      // $(this).tab('show')
      $(this).parent().find('li').removeClass('active');
      $(this).addClass('active');
    });
    // to get name
    if (localStorageService.get('name')) {
      $scope.name = localStorageService.get('name');
    }
    if (localStorageService.get('email')) {
      $scope.email = localStorageService.get('email');
    }
    // to check if user logged in
    $scope.loginChecker = isLoggedIn;
    console.log($scope.loginChecker);
    //functions
    $scope.login = function() {
      $rootScope.$broadcast('login');
      $uibModalInstance.close();
    };
    $scope.logout = function() {
      $rootScope.$broadcast('logout');
      $uibModalInstance.close();
    };
    $scope.close = function() {
      $uibModalInstance.close();
    };
  });

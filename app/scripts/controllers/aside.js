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
        if (localStorageService.get('name')) {
            $scope.name = localStorageService.get('name');
        }
        $scope.loginChecker = isLoggedIn;
        console.log($scope.loginChecker);
        $scope.login = function() {
            $rootScope.$broadcast('login');
            $uibModalInstance.close();
        };
        $scope.logout = function(){
        	$rootScope.$broadcast('logout');
            $uibModalInstance.close();
        };
        $scope.close = function(){
        	$uibModalInstance.close();
        };
    });
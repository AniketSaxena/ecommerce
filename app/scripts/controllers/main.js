'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', function($state, $scope, $uibModal, localStorageService) {
        //Variables
        var id;
        var vm = this;
        var items;
        var total;
        var checker;
        this.checker = true;
        this.tatal = 0;
        //Variable Definition
        items = localStorageService.get('quantity');
        //Listening for log In
        $scope.$on('login', function(event) {
            vm.open();
        });
        //Listening for getting total items
        $scope.$on('totalQuantity',function(totalQuantity){
            console.log(totalQuantity.targetScope.totalQuantity);
            vm.total = totalQuantity.targetScope.totalQuantity;
        });

        if($scope.totalQuantity === 0){
            vm.checker = true;
        } else {
            vm.checker = false;
        }
        //Function for opening login modal
        this.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/loginmodal.html',
                size: 'sm',
                controller: 'LoginmodalCtrl',
                controllerAs: 'login'
            }).result.then(function() {
                vm.checkLoggedIn();
            }).catch(function() {});
        };
        //Function for logging out
        this.logout = function() {
            localStorageService.remove('name');
            localStorageService.remove('phone');
            localStorageService.remove('email');
            localStorageService.remove('userId');
            localStorageService.remove('id');

            vm.isLoggedIn = false;
            $state.go('main.home');
        };

        // Run this functin to check if the user is already logged in
        this.checkLoggedIn = function() {
            if (localStorageService.get('name')) {
                vm.isLoggedIn = true;
                vm.customerName = localStorageService.get('name');
                vm.customerEmail = localStorageService.get('email');
            } else {

            }
        };
        this.checkLoggedIn();
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', function($aside, $state, $scope, $uibModal, localStorageService) {
        //Variables
        var id;
        var vm = this;
        var items;
        var total;
        var checker;
        var cartChecker;
        this.checker = true;
        this.tatal = 0;
        this.cartChecker = false;
        // for navbar collapse on click
        $('.nav a').on('click', function() {
            $('.navbar-toggle').click() //bootstrap 3.x by Richard
        });
        //Variable Definition
        items = localStorageService.get('quantity');
        //Listening for log In
        $scope.$on('login', function(event) {
            vm.open();
        });
        //Listening for log out
        $scope.$on('logout', function(event) {
            vm.logout();
        });
        //Listening for getting total items
        $scope.$on('totalQuantity', function(totalQuantity) {
            console.log(totalQuantity.targetScope.totalQuantity);
            vm.total = totalQuantity.targetScope.totalQuantity;
            // if(vm.total === 0)
            // {
            //     vm.cartChecker = false;
            // } else {
            vm.cartChecker = true;
            // }
        });
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
            //This function removes the following items from local storage
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
            } else {}
        };
        this.openAside = function() {
            var asideInstance = $aside.open({
                templateUrl: '/views/aside.html',
                controller: 'AsideCtrl',
                placement: 'right',
                size: 'lg',
                resolve: {
                    isLoggedIn: function(){
                        return vm.isLoggedIn;
                    }
                }
            });
        };
        this.checkLoggedIn();
    });
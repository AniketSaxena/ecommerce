'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', function($uibModal, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var id;
        var vm = this;
        var items;
        items = localStorageService.get('quantity');
        this.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/loginmodal.html',
                size: 'sm',
                controller: 'LoginmodalCtrl',
                controllerAs: 'login'
            }).result.then(function(){
                vm.checkLoggedIn();
            }).catch(function(){

            });
        };
        this.logout = function() {
            localStorageService.remove('name');
            localStorageService.remove('phone');
            localStorageService.remove('email');
            vm.isLoggedIn = false;
        };
        
        // Run this functin to check if the user is already logged in
        this.checkLoggedIn = function(){
            if(localStorageService.get('name')){
                vm.isLoggedIn = true;
                vm.customerName = localStorageService.get('name');
                vm.customerEmail = localStorageService.get('email');
            }else{
              
            }
        };

        this.checkLoggedIn();

    });
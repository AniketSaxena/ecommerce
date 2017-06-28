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
        var totalQuantity;
        //Variable Definition
        items = localStorageService.get('quantity');
        //Listening for log In
        $scope.$on('login',function(event){
            vm.open();
        });
        //Function for opening login modal
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
        //Function for logging out
        this.logout = function() {
            localStorageService.remove('name');
            localStorageService.remove('phone');
            localStorageService.remove('email');
            localStorageService.remove('userId');
            vm.isLoggedIn = false;
            $state.go('main.home');
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
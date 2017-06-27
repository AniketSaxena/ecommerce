'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', function($scope, $uibModal, localStorageService) {
        //Variables
        var id;
        var vm = this;
        var items;
        var total;
        var totalQuantity;
        //Variable Definition
        this.total = localStorageService.get('total');
        items = localStorageService.get('quantity');
        //Listening for total Quantity
        $scope.$on('total', function(event, data){
            console.log(data);
            $scope.totalQuantity = data;
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
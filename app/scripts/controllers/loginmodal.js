'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', function($scope, $rootScope, loginService, customerService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm;
        vm = this;
        this.user = {};
      
        this.login = function() {
            loginService.loginUser(vm.user)
                .then(function(response) {
                    console.log(vm.user);
                    console.log(response);
                }).catch(function(error) {
                    console.log(error);
                });
        };
         this.checkUser = function(){
            if(vm.user.phone.length === 10){
                customerService.checkUser(vm.user.phone)
                .then(function(response){
                    console.log(response);
                }).catch(function(error){
                    console.log(error);
                });
            }
         };
    });
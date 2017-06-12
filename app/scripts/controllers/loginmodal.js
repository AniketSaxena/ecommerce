'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', function($scope, $http, $rootScope, loginService, orderService, customerService, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm;
        var val;
        //var orderId;

        vm = this;
        this.user = {};
        console.log(localStorageService);
        console.log(localStorageService.set('key', 'ihaorgihjroig'));
        this.login = function() {
            /*Was done before*/
            // loginService.loginUser(vm.user)
            //     .then(function(response) {
            //         console.log(response.data.token);
            //         val = response.data.token;
            //         localStorageService.set('token', val);
            //         console.log(localStorageService.get('token'));
            //         $http.defaults.headers.common['x-access-token'] = val;
            //         $http.defaults.headers.post['x-access-token'] = val;
            //         $http.defaults.headers.put['x-access-token'] = val;

                        //put createOrder here?

            //     }).catch(function(error) {
            //         console.log(error);
            //     });


            // orderService.createOrder()
            // .then(function(response){
            //     console.log(response.data);
            //      orderId = reponse.data;
            // }).catch(function(error){
            //     console.log(error);
            // });
            // how to attach to token??
        };
        this.checkUser = function() {
            if (vm.user.phone.length === 10) {
                customerService.checkUser(vm.user.phone)
                    .then(function(response) {
                        console.log(response);
                    }).catch(function(error) {
                        console.log(error);
                    });
            }
        };
    });
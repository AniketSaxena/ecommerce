'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', function($uibModal, $uibModalInstance, $scope, $http, $rootScope, loginService, orderService, customerService, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm;
        var val;
        vm = this;
        this.user = {};
        console.log(localStorageService);
        console.log(localStorageService.set('key', 'ihaorgihjroig'));
        this.login = function() {
            loginService.loginUser(vm.user)
                .then(function(response) {
                    console.log(response.data.token);
                    localStorageService.set('id', response.data.customer.objectId);
                    console.log(localStorageService.get('id'));
                    localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last||'');
                    console.log(localStorageService.get('name'));
                    localStorageService.set('phone', response.data.customer.phone);
                    console.log(localStorageService.get('phone'));
                    localStorageService.set('email', response.data.email);
                    console.log(localStorageService.get('email'));
                    return orderService.createOrder();
                })
                .then(function(response) {
                    console.log(response);
                    
                    $uibModalInstance.close('User Logged In');
                })
                .catch(function(error) {
                    console.log(error);
                    $uibModalInstance.dismiss('caught an error');
                    vm.register(vm.register.phone);
                });
        };
        this.checkUser = function() {
            if (vm.user.phone.length === 10) {
                customerService.checkUser(vm.user.phone)
                    .then(function(response) {
                        console.log(response);
                        console.log(response.data.code);
                        if (response.data.code === 668 || response.data.code === 1001) {
                            $uibModalInstance.dismiss('error 668');
                            vm.register(vm.user.phone);
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
            }
        };
        this.register = function(phone) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/registermodal.html',
                size: 'sm',
                controller: 'RegistermodalCtrl',
                ControllerAs: 'register',
                resolve: {
                    phone: function() {
                        return phone;
                    }
                }
            });
        };
        this.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
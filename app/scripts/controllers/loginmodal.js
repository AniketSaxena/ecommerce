'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', function($uibModal, $uibModalInstance, $scope, $http, $rootScope, loginService, orderService, customerService, localStorageService, ENV) {
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
                    localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last||'');
                    console.log(localStorageService.get('name'));
                    localStorageService.set('phone', response.data.customer.phone);
                    console.log(localStorageService.get('phone'));
                    localStorageService.set('email', response.data.email);
                    console.log(localStorageService.get('email'));
                    if(localStorageService.get('id')){
                        $uibModalInstance.close();
                     }else{
                        return orderService.createOrder();
                     }
                })
                .then(function(response) {
                    console.log(response.data);
                    localStorageService.set('id',response.data.objectId);
                    $uibModalInstance.close('User Logged In');
                    console.log(localStorageService.get('id'));
                    console.log(response.data.objectId);

                    //added now

                    var info = {
                        orderId: localStorageService.get('id'),
                        userId: localStorageService.get('userId'),
                        style: ENV.style
                    };
                    console.log(info);

                    return orderService.updateInfo(info);
                })
                .then(function(response){
                    console.log(response);
                    console.log(response.data);
                })

                // till here

                .catch(function(error) {
                    console.log(error);
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
            $uibModalInstance.close('cancel');
        };



        localStorageService.remove('id');
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', function($state, $uibModal, $uibModalInstance, $scope, $http, $rootScope, loginService, orderService, customerService, localStorageService, ENV) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm;
        var val;
        var userId;
        var state;
        var id;
        vm = this;
        this.id;
        this.state;
        this.user = {};
        this.userId = localStorageService.get('userId');
        this.login = function() {
            loginService.loginUser(vm.user)
                .then(function(response) {
                    localStorageService.set('userId', response.data.customer.objectId);
                    localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last||'');
                    localStorageService.set('phone', response.data.customer.phone);
                    localStorageService.set('email', response.data.email);
                    vm.getUserOrders();
                    if(vm.id && vm.data === "initiated"){
                        if(vm.id === localStorageService.get('id')){
                            return true;
                        } else {
                            localStorageService.set('id',vm.id);
                        }
                    } else {
                        return orderService,createOrder();
                    }
                })
                .then(function(response) {
                    console.log(response);
                    
                    if(response.data && response.data.objectId){
                        localStorageService.set('id',response.data.objectId);
                    }
                    
                    $uibModalInstance.close('User Logged In');

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
                    localStorageService.remove('id');
                    $state.reload();
                })
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
        this.getUserOrders = function(){
            orderService.getOrders(0, 1, userId, "createdAt") 
            .then(function(response){
                _.each(response.data,function(data){
                    vm.state = data.state;
                    vm.id = data.id;
                }).catch(function(error){
                    console.log(error);
                });
            })
        }
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('AccountCtrl', function($scope, localStorageService, orderService, customerService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var name;
        var phone;
        var email;
        var id;
        var checker; //will check if address is there or not
        // var userAddress = {};
        // var newAddress = {};    //will store all details about address.
        $scope.orders = [];
        $scope.customerId = localStorageService.get('userId');
        $scope.name = localStorageService.get('name');
        $scope.phone = localStorageService.get('phone');
        $scope.email = localStorageService.get('email');
        $scope.checker = false;
        // this function gives address as object and customerid to store address in customerId
        // this.submit = function(newAddress, id){
        //   customerService.addAddress(newAddress, id)
        //   .then(function(response){
        //     console.log(response);
        //     vm.userAddress = vm.newAddress;
        //     vm.checker = true;
        //   }).catch(function(error){
        //     console.log(error);
        //   });
        // };
        //this function gives the address of the customer by sending customerId
        // this.address = function(id){
        //   customerService.getAddress(id)
        //   .then(function(response){
        //     if(response.data.flatBldgName){
        //       console.log(response.data);
        //       vm.checker = true;
        //       vm.userAddress = response.data;
        //     }
        //   }).catch(function(error){
        //     console.log(error);
        //   });
        // };
        $scope.getUserAddresses = function() {
            customerService.getAddresses($scope.customerId)
                .then(function(addresses) {
                    $scope.addresses = addresses;
                    $scope.$emit('load-end');
                    console.log($scope.addresses);
                    if ($scope.addresses.length === 0) {
                        $scope.checker = false;
                        console.log($scope.checker);
                    } else {
                        $scope.checker = true;
                        console.log($scope.checker);
                    }
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };
        $scope.saveAddress = function() {
            console.log($scope.newAddress);
            console.log($scope.customerId);
            customerService
                .addAddress($scope.newAddress, $scope.customerId)
                .then(function(address) {
                    console.log(address);
                    // if ($scope.source === 'app.products') {
                    //     console.log('here....');
                    //     $state.go($scope.source, { action: 'cart' });
                    // } else {
                    //     $state.go($scope.source);
                    // }
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };

        
        // DUMMY CODE FOR REMOVAL OF ADDRESS
        // $scope.removeAddress = function() {
        //     customerService.removeAddress($scope.address)
        //     .then(function(response){
        //         console.log(response);
        //     }).catch(function(error){
        //         console.log(error);
        //     });
        // };

        $scope.getOrderHistory = function(skip, limit, user) {
            orderService.getOrders(skip, limit, user)
                .then(function(response) {
                    console.log(response);
                    angular.forEach(response.data, function(element) {
                        $scope.orders.push(element);
                    });
                    console.log($scope.orders);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        $scope.addMore = function() {
            $scope.checker = false;
        };
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses($scope.customerId);
        console.log(this.checker);
    });
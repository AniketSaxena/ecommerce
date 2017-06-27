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
        // List of variables        
        var name;
        var phone;
        var email;
        var id;
        var checker; 
        //Variable Definition
        $scope.orders = [];
        $scope.customerId = localStorageService.get('userId');
        $scope.name = localStorageService.get('name');
        $scope.phone = localStorageService.get('phone');
        $scope.email = localStorageService.get('email');
        $scope.checker = false;
        //Function to get user address
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
        //Function to save address
        $scope.saveAddress = function() {
            console.log($scope.newAddress);
            console.log($scope.customerId);
            customerService
                .addAddress($scope.newAddress, $scope.customerId)
                .then(function(address) {
                    console.log(address);
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };
        //Function to get Order History
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
        //Function to add more addresses
        $scope.addMore = function() {
            $scope.checker = false;
        };
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses($scope.customerId);
        console.log(this.checker);
    });
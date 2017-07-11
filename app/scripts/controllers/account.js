'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('AccountCtrl', function(ENV, $state, $scope, localStorageService, orderService, customerService) {
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
        $scope.moment;
        $scope.isInitiated = false;
        //Function to get user address
        $scope.getUserAddresses = function() {
            // service to get customer's address
            customerService.getAddresses($scope.customerId)
                .then(function(addresses) {
                    //setting the address
                    $scope.addresses = addresses;
                    $scope.$emit('load-end');
                    console.log($scope.addresses);
                    // to check if address exists
                    if ($scope.addresses.length === 0) {
                        // in this case address does not exist
                        $scope.checker = false;
                        console.log($scope.checker);
                    } else {
                        // in this case address exists
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
            //service to add address to server
            customerService
                .addAddress($scope.newAddress, $scope.customerId)
                .then(function(address) {
                    console.log(address);
                    $state.reload();
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };
        //Function to get Order History
        $scope.getOrderHistory = function(skip, limit, user) {
            //service to get orders of the user from the server
            orderService.getOrders(skip, limit, user, 'createdAt')
                .then(function(response) {
                    console.log(response);
                    // for each order since we can have many orders
                    angular.forEach(response.data, function(element) {
                        element.url = ENV.serverURL + '/' + element.id;
                        $scope.orders.push(element);
                        console.log($scope.orders);
                        // if order state is initiated find time to delivery and show it on html
                        if(element.state === "initiated"){
                            $scope.moment=moment(element.date, "YYYYMMDD").fromNow();
                            $scope.isInitiated = true;
                        }
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
        $scope.goBack = function(){
            $scope.checker = true; 
        };
        // these functions to be called on page load
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses($scope.customerId);
        console.log(this.checker);
    });
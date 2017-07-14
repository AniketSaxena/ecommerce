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
    //Variable Definition
    $scope.newAddress = {};
    $scope.orders = [];
    $scope.customerId = localStorageService.get('userId');
    $scope.name = localStorageService.get('name');
    $scope.phone = localStorageService.get('phone');
    $scope.email = localStorageService.get('email');
    $scope.checker = false;
    $scope.isInitiated = false;
    // To show top of page when page loads
    $(document).ready(function() {
      $(this).scrollTop(0);
    });
    //Function to get user address
    $scope.getUserAddresses = function() {
      customerService.getAddresses($scope.customerId)
        .then(function(response) {
          var addresses = response.data;
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
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
          //             $scope.$emit('error', error.message);
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
          // $state.reload();
          $scope.getUserAddresses();
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
          //             $scope.$emit('error', error.message);
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
            element.url = ENV.serverURL + '/view/' + element.id;
            $scope.orders.push(element);
            console.log($scope.orders);
          });
          console.log($scope.orders);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };
    $scope.removeAddress = function(address, index) {
      customerService.removeAddress(address.id)
        .then(function(response) {
          console.log(response);
          $scope.addresses.splice(index, 1);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };
    //Function to add more addresses
    $scope.addMore = function() {
      $scope.checker = false;
    };
    $scope.goBack = function() {
      $scope.checker = true;
    };
    // $scope.changePin = function(){
    //     customerService.changePin($scope.newAddress.pincode)
    //     .then(function(response){
    //         console.log(response);
    //     })
    //     .catch(function(error){
    //         console.log(error);
    //     });
    // };
    // these functions to be called on page load
    $scope.getOrderHistory(0, 10, $scope.customerId);
    $scope.getUserAddresses();
    console.log(this.checker);
  });

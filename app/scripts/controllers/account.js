'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AccountCtrl', function(ENV, $state, $scope, localStorageService, orderService, customerService, $location) {
    /**
     * Function to get the list of addresses for this user
     * @return {void} 
     */
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

    /**
     * Function to save the address to user profile
     * @return {[type]} [description]
     */
    $scope.saveAddress = function() {
      $scope.loading = true;
      //service to add address to server
      if (!$scope.newAddress.id) {
        // Save a new address
        customerService
          .addAddress($scope.newAddress, $scope.customerId)
          .then(function(address) {
            $scope.loading = false;

            console.log(address);
            $scope.$emit('handleError', { error: { message: 'Address added!' }, title: 'Information Updated' });
            // $state.reload();
            if ($location.search() && $location.search().back) {
              $state.go('main.cart');
            } else {
              $scope.getUserAddresses();
            }
          }).catch(function(error) {
            $scope.loading = false;

            $scope.$emit('handleError', { error: error.data });
            console.error(error);
          });
      } else {
        customerService
          .updateAddress($scope.newAddress.id, $scope.newAddress)
          .then(function(address) {
            $scope.loading = false;

            console.log(address);
            // $state.reload();
            $scope.$emit('handleError', { error: { message: 'Address updated!' }, title: 'Information Updated' });
            $scope.getUserAddresses();
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error.data });
            console.error(error);
            $scope.loading = false;

          });
      }

    };

    /**
     * Function to get the order history
     * @param  {Integer} skip  Page number
     * @param  {Integer} limit Page size
     * @param  {String} user  ID of the user
     * @return {void}       
     */
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

    /**
     * Function to remove an existing address
     * @param  {Object} address Address selected
     * @param  {Integer} index   Index in the list of addresses
     * @return {void}         
     */
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


    $scope.editAddress = function(address) {
      $scope.checker = false;
      $scope.newAddress = address;
    };

    /**
     * [addMore description]
     */
    $scope.addMore = function() {
      $scope.checker = false;
    };

    /**
     * [goBack description]
     * @return {[type]} [description]
     */
    $scope.goBack = function() {
      $scope.checker = true;
    };

    /**
     * Function to get city and state based on pincode
     * @return {void} 
     */
    $scope.changePin = function() {
      if ($scope.newAddress.pincode && $scope.newAddress.pincode.toString().length === 6) {
        customerService.changePin($scope.newAddress.pincode)
          .then(function(response) {
            console.log(response);
            var pinData = response.data;
            $scope.newAddress.city = pinData.records[0].regionname;
            $scope.newAddress.state = pinData.records[0].statename;
          })
          .catch(function(error) {
            console.error(error);
            $scope.$emit('handleError', { error: error });
          });
      }
    };

    $scope.pre = function() {

      // these functions to be called on page load

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

      if ($scope.customerId) {
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses();
      } else {
        $scope.$emit('login');
        $state.go('main.home');
      }

    };

    $scope.pre();

    $scope.changePassword = function() {
      $scope.$emit('reset-password', { phone: $scope.phone, email: $scope.email, customerId: $scope.customerId });
    };

  });

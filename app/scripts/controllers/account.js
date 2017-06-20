'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AccountCtrl', function (localStorageService, orderService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var name;
    var phone;
    var email;
    var id;
    // var checker = false;     //will check if address is there or not
    var vm = this;
    // var userAddress = {};
    // var newAddress = {};    //will store all details about address.

    this.orders = [];


    this.id = localStorageService.get('userId');
    this.name = localStorageService.get('name');
    this.phone = localStorageService.get('phone');
    this.email = localStorageService.get('email');

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


      this.getOrderHistory = function(skip, limit, user){
        orderService.getOrders(skip, limit, user)
        .then(function(response){
          angular.forEach(response.data, function(element) {
            vm.orders.push(element);
          });

          _.each(vm.orders ,function(order){
            console.log(order.state);
          });
          console.log(vm.orders);
        }).catch(function(error){
          console.log(error);
        });
      };

      this.getOrderHistory(0,10,vm.id);
      // this.address(this.id);
  });

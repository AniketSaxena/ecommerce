'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ConfirmCtrl
 * @description
 * # ConfirmCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ConfirmCtrl', function (localStorageService, orderService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var id;
    var name;
    var phone;
    var email;
    var address;
    var items;
    var order;
    var vm = this;
    this.id = localStorageService.get('id')
    this.name = localStorageService.get('name');
    this.phone = localStorageService.get('phone');
    this.email = localStorageService.get('email');
    this.address = localStorageService.get('selectedAddress');
    this.items = [];
    this.order = {};
    this.getOrderDetails = function(){
    	orderService.getOrder(vm.id)
    	.then(function(response){
    		console.log(response);
    	})
    	.catch(function(error){
    		console.log(error);
    	});
    };
    this.getItems = function(){
    	orderService.getOrderItems(vm.id)
    	.then(function(response){
    		vm.items = response.data;
    		console.log(vm.items);
    		vm.calculateTotal(vm.items);
    	})
    	.catch(function(error){
    		console.log(error);
    	});
    };
    this.sum = function() {
            console.log('addOnTax:' + vm.order.addOnTax + ' delivery:' + vm.order.deliveryCharge + ' tax:' + vm.order.tax);
            vm.order.total =
                parseFloat(vm.order.subtotal) +
                parseFloat(vm.order.tax) +
                parseFloat(vm.order.addOnTax) +
                parseFloat(vm.order.deliveryCharge) -
                parseFloat(vm.order.discount);
        };
        this.calculateTotal = function(items) {
            console.log('calculating total...');
            vm.order.total = vm.order.subtotal = vm.order.tax = vm.order.addOnTax = vm.order.discount = vm.order.deliveryCharge = 0;
            _.each(items, function(item) {
                console.log('calculating subtotal');
                // if(vm.discount){
                // vm.order.subtotal += (item.quantity * items.cost) - vm.discount;
                // } else {
                vm.order.subtotal += (item.quantity * item.cost);
                // }
                console.log(vm.order.subtotal);
                if (item.discount) {
                    console.log(item.discount);
                    vm.order.discount += (item.quantity * item.discount);
                    console.log(vm.order.discount);
                }
                if (item.tax) {
                    console.log(item.tax);
                    vm.order.tax += (item.quantity * item.tax);
                    console.log(vm.order.tax);
                }
                if (item.deliveryCharge) {
                    console.log(item.deliveryCharge);
                    vm.order.deliveryCharge += (item.quantity * item.deliveryCharge);
                    console.log(vm.order.deliveryCharge);
                }
                vm.sum();
            });
        };
    this.getItems();
    this.getOrderDetails();
  });

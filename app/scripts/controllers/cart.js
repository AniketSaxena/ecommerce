'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function(orderService, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        var orderId;

        // CHECKOUT
        // var name;
        // var phone;
        // var email;
        // var address;
        // this.amount = 0;

        // this.name = localStorageService.get('name');
        // this.phone = localStorageService.get('phone');

        // // this.address = localStorageService.get('address');
        // this.address = 'ahiohei';

        orderId = localStorageService.get('id');
        this.items = [];
        this.loadItems = function() {
            console.log('show the loader');
            vm.items = [];
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    angular.forEach(response.data, function(element) {
                        vm.items.push(element);
                    });
                }).catch(function(error) {
                    console.error(error);
                });
            vm.counter++;
            console.log('entering page number ' + vm.counter);
        };
        this.removeItem = function(index) {
            var item = vm.items[index];
            vm.items.splice(index, 1);
            orderService.removeOrderItem(item.id)
                .then(function(response) {
                    console.log(response);
                    // ngToast.create('removed!');
                    // vm.loadItems();
                }).catch(function(error) {
                    console.log(error);
                });
        };
        this.increaseItem = function(index) {
            vm.items[index].changing = true;
            vm.items[index].quantity = vm.items[index].quantity + 1;
            orderService.updateOrderItem(vm.items[index].id, vm.items[index].quantity, null, null, null, orderId)
                .then(function(response) {
                    console.log(response);
                    vm.items[index].changing = false;
                    if (vm.items[index].quantity >= 2) {
                        vm.items[index].min = false;
                    }
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };
        this.decreaseItem = function(index) {
            vm.items[index].changing = true;
            vm.items[index].quantity = vm.items[index].quantity - 1;
            orderService.updateOrderItem(vm.items[index].id, vm.items[index].quantity, null, null, null, orderId)
                .then(function(response) {
                    console.log(response);
                    if (vm.items[index].quantity <= 1) {
                        vm.items[index].min = true;
                    }
                    vm.items[index].changing = false;
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };

        // CHECKOUT 
        // this.checkout = function(){
        //     orderService.generateLink(vm.name, vm.phone, vm.email, vm.amount, vm.address)
        //     .then(function(response){
        //         console.log(response);
        //     }).catch(function(error){
        //         console.log(error);
        //     });
        // };
        this.loadItems();
    });
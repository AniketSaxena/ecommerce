'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function($scope, ENV, orderService, localStorageService, customerService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        var orderId;

        // CHECKOUT
        var name;
        var phone;
        var email;
        var addresses;
        this.amount = 0;

        this.name = localStorageService.get('name');
        this.phone = localStorageService.get('phone');

        this.addresses = {};

        this.order = {};

        orderId = localStorageService.get('id');
        this.items = [];
        this.loadItems = function() {
            console.log('show the loader');
            vm.items = [];
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    console.log(response);
                    angular.forEach(response.data, function(element) {
                        vm.items.push(element);
                    });
                    vm.calculateTotal(vm.items);
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
        // this.checkout = function() {
        //     customerService.getAddresses(localStorageService.get('userId'))
        //         .then(function(addresses) {
        //             vm.addresses = addresses;
        //             console.log(vm.addresses);
        //             var data = {
        //                 orderId: localStorageService.get('id'),
        //                 name: vm.name,
        //                 email: vm.email,
        //                 phone: vm.phone,
        //                 amount: vm.order.total,
        //                 successUrl: ENV.successURL,
        //                 webhookUrl: ENV.webhookURL
        //             };
        //             return orderService.generateLink(data)
        //         })
        //         .then(function(response) {
        //             console.log(response);
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // };

        //  NOT NEEDED
        // this.checkout = function(){
        //     console.log(vm.order.total);
        //     var info = {
        //         amount: vm.order.total,
        //         name: localStorageService.get('name'),
        //         email: localStorageService.get('email'),
        //         phone: localStorageService.get('phone')
        //     };
        //     orderService.checkout(info)
        //     .then(function(response){
        //         console.log(response.longurl);
        //     }).catch(function(error){
        //         console.log(error);
        //     });
        // };


        this.sum = function() {
            console.log('addOnTax:' + vm.order.addOnTax + ' delivery:' + vm.order.deliveryCharge + ' tax:' + vm.order.tax);
            vm.order.total =
                parseFloat(vm.order.subtotal) +
                parseFloat(vm.order.tax) +
                parseFloat(vm.order.addOnTax) +
                parseFloat(vm.order.deliveryCharge) -
                parseFloat(vm.order.discount);
            console.log(vm.order.total);
            console.log(vm.order.tax);
            console.log(vm.order.addOnTax);
            console.log(vm.order.deliveryCharge);
            console.log(vm.order.discount);
        };

        this.calculateTotal = function(items) {
            console.log('calculating total...');
            console.log(items);
            vm.order.total = vm.order.subtotal = vm.order.tax = vm.order.addOnTax = vm.order.discount = vm.order.deliveryCharge =0;
            _.each(items, function(item) {
                console.log('calculating subtotal');
                console.log(item);
                console.log(item.quantity);
                console.log(item.cost);
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


        this.getOrderDetails = function(orderId) {
            orderService.getOrder(orderId)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        this.loadItems();
        this.getOrderDetails(orderId);
    });
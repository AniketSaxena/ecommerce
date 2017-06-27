'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function($rootScope, $state, $uibModal, $scope, ENV, orderService, localStorageService, customerService) {
        //List of variables
        var vm = this;
        var orderId;
        var name;
        var phone;
        var email;
        var addresses;
        var addressExist;
        var selectedAddress;
        var addressSelected;
        var totalQuantity;
        //Initializing variables
        $scope.totalQuantity = 0;
        this.addressExist = false;
        this.customerId = localStorageService.get('userId');
        this.amount = 0;
        this.name = localStorageService.get('name');
        this.phone = localStorageService.get('phone');
        this.addresses = {};
        this.order = {};
        orderId = localStorageService.get('id');
        this.items = [];
        $scope.items = [];
        this.selectedAddress = localStorageService.get('selectedAddress');
        //Checking if address alreadu selected or not
        if (localStorageService.get('selectedAddress')) {
            vm.addressSelected = true;
        } else {
            vm.addressSelected = false;
        }
        // Affixing checkout and address selection card
        $('#checkoutCard').affix({
            offset: {
                top: 10,
            }
        });
        //Setting width of card on affix to value before affix
        $(document).on('affix.bs.affix', '.panel', function() {
            $(this).width($(this).width());
        });
        $('#checkoutCard').affix('checkPosition');
        //Watcher for total amount
        $scope.$watch('totalQuantity', function(newValue, oldValue) {
            vm.calculateTotal(vm.items);
        });
        // Function to load items
        this.loadItems = function() {
            console.log('show the loader');
            vm.items = [];
            $scope.items = [];
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    angular.forEach(response.data, function(element) {
                        if(element.quantity === 1){
                            element.min = true;
                        }
                        vm.items.push(element);
                        $scope.items.push(element);
                        $scope.totalQuantity = $scope.totalQuantity + element.quantity;
                        $scope.$emit('total',totalQuantity);
                        });
                    vm.calculateTotal(vm.items);
                }).catch(function(error) {
                    console.error(error);
                });
            vm.counter++;
            console.log('entering page number ' + vm.counter);
        };
        // Function to remove items
        this.removeItem = function(index) {
            var item = vm.items[index];
            vm.items.splice(index, 1);
            orderService.removeOrderItem(item.id)
                .then(function(response) {
                    console.log(response);
                    $scope.totalQuantity = $scope.totalQuantity - vm.items[index].quantity;
                    $scope.$emit('total',totalQuantity);
                    // ngToast.create('removed!');
                    // vm.loadItems();
                }).catch(function(error) {
                    console.log(error);
                });
        };
        // Function to increase item quantity
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
                    $scope.totalQuantity = $scope.totalQuantity + 1;
                    $scope.$emit('total',totalQuantity);
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };
        // Function to decrease item quantity
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
                    $scope.totalQuantity = $scope.totalQuantity - 1;
                    $scope.$emit('total',totalQuantity);
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };
        // Checkout function logic for instamojo
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
        // Function to Calculate sum of all costs
        this.sum = function() {
            console.log('addOnTax:' + vm.order.addOnTax + ' delivery:' + vm.order.deliveryCharge + ' tax:' + vm.order.tax);
            vm.order.total =
                parseFloat(vm.order.subtotal) +
                parseFloat(vm.order.tax) +
                parseFloat(vm.order.addOnTax) +
                parseFloat(vm.order.deliveryCharge) -
                parseFloat(vm.order.discount);
        };
        //Function to calculate the total amount
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
                if (item.discount) {
                    vm.order.discount += (item.quantity * item.discount);
                }
                if (item.tax) {
                    vm.order.tax += (item.quantity * item.tax);
                }
                if (item.deliveryCharge) {
                    vm.order.deliveryCharge += (item.quantity * item.deliveryCharge);
                }
                vm.sum();
            });
        };
        //Function to get order details
        this.getOrderDetails = function(orderId) {
            orderService.getOrder(orderId)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        // Function to get user's address
        this.getUserAddresses = function() {
            customerService.getAddresses(vm.customerId)
                .then(function(addresses) {
                    vm.addresses = addresses;
                    if (vm.addresses.length === 0) {
                        vm.addressExist = false;
                    } else {
                        vm.addressExist = true;
                    }
                }).catch(function(error) {
                    console.log(error);
                });
        };
        // Function to change address 
        this.change = function() {
            vm.addressSelected = false;
            localStorageService.remove('selectedAddress');
        };
        // Function to select address
        this.selectAddress = function(index) {
            vm.selectedAddress = vm.addresses[index];
            vm.addressSelected = true;
            localStorageService.set('selectedAddress', vm.selectedAddress);
            var info = {
                orderId: localStorageService.get('id'),
                addressId: vm.selectedAddress.id
            };
            orderService.updateInfo(info)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        //Below functions are called on page loading
        this.getUserAddresses();
        this.loadItems();
        this.getOrderDetails(orderId);
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('ProductCtrl', function($scope, $stateParams, productService, orderService, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        var orderId;
        var checker;
        this.product = {};
        this.product.smallImage = "https://placeholdit.co//i/400x400?&text=Random";
        this.product.mediumImage = "https://placeholdit.co//i/800x800?&text=Random";
        this.product.largeImage = "https://placeholdit.co//i/1200x1200?&text=Random";
        this.id = $stateParams.id;
        this.checker = false;
        if(localStorageService.get('id')) {
            vm.checker = true;
            this.orderId = localStorageService.get('id');
        }
        this.loadProduct = function(id) {
            productService.getProduct(id)
                .then(function(response) {
                    vm.product = response.data;
                    console.log(vm.product);
                    //  FOR IMAGES
                    //vm.loadImages(vm.product.images);
                });
        };

        this.getItems = function(orderId) {
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    _.each(response.data, function(orderItem) {
                        if (orderItem.itemId === vm.product.id) {
                            console.log('got it');
                            vm.product.quantity = orderItem.quantity;
                            vm.product.addedId = orderItem.id;
                        } else {
                            vm.product.quantity = 0;
                        }
                        console.log(vm.product);
                    });
                }).catch(function(error) {
                    console.log(error);
                });
        };

        // FOR IMAGES
        this.loadImages = function(images) {
            angular.forEach(images, function(image) {
                console.log(image.id);
                productService
                    .getImages(image.id)
                    .then(function(image) {
                        console.log(image);
                        vm.images.push(image);
                    }, function(error) {
                        vm.$emit('error', { message: error });
                    });
            });
        };

        this.addItem = function() {
            // on clicking add item
            vm.product.adding = true;
            var item = {
                itemId: vm.product.id,
                quantity: 1
            };
            var items = [];
            items.push(item);
            // if item was already added and has quantity > 0
            if (vm.product.quantity !== 0) {
                vm.product.quantity++;
                orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, vm.orderId)
                    .then(function(response) {
                        console.log(response);
                        // vm.product.adding = false;
                        console.log(vm.product.quantity);
                    }).catch(function(error) {
                        console.log(error);
                        // vm.product.adding = false;
                    });
            } else {
                //if Product quantity is 0 and was not added before
                orderService.addOrderItem(items)
                    .then(function(response) {
                        var orderItemId;
                        // console.log(response.data);
                        orderItemId = response.data;
                        console.log(orderItemId);
                        vm.product.quantity++;
                        vm.product.addedId = orderItemId;
                        return orderService.linkOrder(vm.orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        vm.product.adding = false;
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.product.adding = false;
                    });
            }
        };

        this.addItemLoggedOut = function() {
            // on clicking add item
            vm.product.adding = true;
            var item = {
                itemId: vm.product.id,
                quantity: 1
            };
            var items = [];
            items.push(item);
            console.log(vm.product);
            if (vm.orderId) {
                if (vm.product.quantity !== 0) {
                    vm.product.quantity++;
                    orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, vm.orderId)
                        .then(function(response) {
                            console.log(response);
                            // vm.product.adding = false;
                            console.log(vm.product.quantity);
                        }).catch(function(error) {
                            console.log(error);
                            // vm.product.adding = false;
                        });
                } else {
                    //if Product quantity is 0 and was not added before
                    orderService.addOrderItem(items)
                        .then(function(response) {
                            var orderItemId;
                            // console.log(response.data);
                            orderItemId = response.data;
                            console.log(orderItemId);
                            vm.product.quantity++;
                            vm.product.addedId = orderItemId;
                            return orderService.linkOrder(vm.orderId, orderItemId);
                        })
                        .then(function(response) {
                            console.log(response);
                            vm.product.adding = false;
                        })
                        .catch(function(error) {
                            console.error(error);
                            vm.product.adding = false;
                        });
                }
            } else {
                orderService.createOrder()
                    .then(function(response) {
                        vm.orderId = response.data.objectId;
                        localStorageService.set('id', vm.orderId);
                        return orderService.addOrderItem(items)
                    }).then(function(response) {
                        var orderItemId;
                        vm.product.quantity++;
                        orderItemId = response.data;
                        vm.product.addedId = orderItemId;
                        return orderService.linkOrder(vm.orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        $scope.totalQuantity = $scope.totalQuantity + 1;
                        vm.product.adding = false;
                        // localStorageService.set('total',vm.total);
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.product.adding = false;
                    });
            }
        }

        this.loadProduct(this.id);
        this.getItems(this.orderId);
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ProductCtrl', function($scope, $stateParams, productService, orderService, localStorageService, $q, $state) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var vm = this;
    this.variants = [];

    // for cart counter
    $scope.$watch('totalQuantity', function(newValue) {
      $scope.$emit('totalQuantity', newValue);
    });

    this.loadVariants = function(id) {
      return productService.getProduct(id).then(function(response) {
        if (response && response.data) {
          return response.data;
        }
      });
    };

    this.loadProduct = function(id) {
      var variantPromises = [];
      productService.getProduct(id)
        .then(function(response) {
          vm.product = response.data;
          if (vm.product.images && vm.product.images.length) {
            vm.loadImages(vm.product.images);
          }

          if (vm.product.variants && vm.product.variants.length) {
            _.each(vm.product.variants, function(v) {
              variantPromises.push(vm.loadVariants(v));
            });
          }

          return $q.all(variantPromises);
        })
        .then(function(result) {
          _.each(result, function(p) {
            vm.variants.push({ id: p.id, name: p.name, subtitle: p.subtitle, rate: p.rate });
          });
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
        });
    };

    this.selectVariant = function(variant) {
      $state.go('main.product', { id: variant.id });
    };

    // function to get order items
    this.getItems = function(orderId) {
      orderService.getOrderItems(orderId)
        .then(function(response) {
          console.log('in get items');
          console.log(response.data.length);
          if (response.data.length === 0) {
            vm.product.quantity = 0;
          } else {
            _.each(response.data, function(orderItem) {
              $scope.totalQuantity = $scope.totalQuantity + orderItem.quantity;
              if (orderItem.itemId === vm.product.id) {
                vm.product.quantity = orderItem.quantity;
                vm.product.addedId = orderItem.id;
              } else {
                vm.product.quantity = 0;
              }
              console.log(vm.product);
            });
          }
          console.log(vm.product.quantity);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
        });
    };

    // FOR IMAGES
    this.loadImages = function(images) {
      angular.forEach(images, function(image) {
        productService
          .getImages(image.objectId)
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
      console.log(vm.product.quantity);
      // if item was already added and has quantity > 0
      if (vm.product.quantity !== 0) {
        vm.product.quantity++;
        orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, vm.orderId)
          .then(function(response) {
            console.log(response);
            // vm.product.adding = false;
            console.log(vm.product.quantity);
            orderService.changeQuantity('add', 1);
            vm.product.adding = false;
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error });

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
            orderService.changeQuantity('add', 1);
            vm.product.adding = false;
          })
          .catch(function(error) {
            $scope.$emit('handleError', { error: error });

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
              orderService.changeQuantity('add', 1);
              vm.product.adding = false;
            }).catch(function(error) {
              $scope.$emit('handleError', { error: error });

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
              orderService.changeQuantity('add', 1);
              vm.product.adding = false;
            })
            .catch(function(error) {
              $scope.$emit('handleError', { error: error });

              console.error(error);
              vm.product.adding = false;
            });
        }
      } else {
        orderService.createOrder()
          .then(function(response) {
            vm.product.quantity = 1;
            vm.orderId = response.data.objectId;
            localStorageService.set('id', vm.orderId);
            return orderService.addOrderItem(items);
          }).then(function(response) {
            var orderItemId;
            orderItemId = response.data;
            vm.product.addedId = orderItemId;
            return orderService.linkOrder(vm.orderId, orderItemId);
          })
          .then(function(response) {
            console.log(response);
            orderService.changeQuantity('add', 1);
            console.log(vm.product.quantity);
            vm.product.adding = false;
            // localStorageService.set('total',vm.total);
          })
          .catch(function(error) {
            $scope.$emit('handleError', { error: error });

            console.error(error);
            vm.product.adding = false;
          });
      }
    };

    this.pre = function() {

      vm.imageOptions = {
        nolazy: true,
        background: false,
        imgAttrs: [{
          class: 'img-responsive animated fadeIn'
        }]
      };

      vm.product = {};
      vm.images = [];
      vm.id = $stateParams.id;
      vm.checker = false;
      $scope.totalQuantity = 0;
      // for stating page from top
      $(document).ready(function() {
        $(vm).scrollTop(0);
      });
      // to check login
      if (localStorageService.get('name')) {
        vm.checker = true;
      }
      // to check and set order id
      if (localStorageService.get('id')) {
        vm.orderId = localStorageService.get('id');
      }

      vm.status = {
        isopen: false
      };

      vm.loadProduct($stateParams.id);
      if (vm.orderId) {
        vm.getItems(vm.orderId);
      }
    };

    this.pre();


  });

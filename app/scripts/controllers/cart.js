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
                    console.log(vm.items);
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
        this.loadItems();
    });
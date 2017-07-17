'use strict';
angular.module('chocoholicsApp')
  .controller('ConfirmCtrl', function($scope, localStorageService, orderService) {
    var orderId = localStorageService.get('id');
    var vm = this;
    this.total = 0;
    this.getTotalAmount = function() {
      orderService.getOrder(orderId)
        .then(function(response) {
          vm.order = response.data;
          if (vm.order.paymentId && vm.order.paymentId.length) {
            localStorageService.remove('id');
          }
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };
    this.getTotalAmount();
  });

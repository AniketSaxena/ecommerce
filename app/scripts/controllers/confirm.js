'use strict';
angular.module('chocoholicsApp')
  .controller('ConfirmCtrl', function($scope, localStorageService, orderService) {
    var orderId = localStorageService.get('id');
    var vm = this;
    this.total = 0;
    this.getTotalAmount = function() {
      orderService.getOrder(orderId)
        .then(function(response) {
          console.log(response);
          vm.total = response.data.total;
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };
    this.getTotalAmount();
  });

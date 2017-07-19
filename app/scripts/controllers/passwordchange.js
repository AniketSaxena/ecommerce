'use strict';
angular.module('chocoholicsApp')
  .controller('PasswordchangeCtrl', function($state, $stateParams, customerService, loginService, $scope) {

    var vm = this;

    this.checkValidRequest = function() {
      loginService
        .checkTempPassword($stateParams.id, $stateParams.pass).then(function(response) {
          console.log(response);
          if (response.data.success) {
            vm.showForm = true;
          }
        })
        .catch(function(error) {
          console.error(error);
          vm.error = error.data.message;
        });
    };

    this.updateProfile = function() {
      vm.loading = true;
      customerService
        .updateProfile($stateParams.id, vm.password)
        .then(function(response) {
          console.log(response);
          $scope.$emit('handleError', { error: 'Password Changed!', title: 'Hooray' });
          $state.go('main.home');
      vm.loading = false;

        })
        .catch(function(error) {
          console.error(error);
          vm.error = error.data.message;
      vm.loading = false;
        });
    };

    this.pre = function() {
      vm.showForm = false;
      vm.checkValidRequest();
    };

    this.pre();

  });

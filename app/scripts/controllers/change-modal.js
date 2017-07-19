'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ChangeModalCtrl
 * @description
 * # ChangeModalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ChangeModalCtrl', function($scope, loginService, $state, phone, email, customerId, localStorageService, $uibModalInstance, $rootScope, customerService) {

    $scope.pre = function() {
      $scope.phone = phone;
      $scope.customerId = customerId;
    };

    $scope.pre();

    $scope.changePassword = function() {
      $scope.loading = true;

      loginService
        .forgotPassword($scope.customerId, $scope.phone)
        .then(function(response) {
          console.log(response);
          $scope.loading = false;

          var message = 'We have sent an email';
          if (email) {
            message = message + ' to ' + email;
          }
          message = message + '. Please follow the instructions there to change your password';

          $scope.$emit('handleError', {
            error: 'We have logged you out of the web site, and an email has been sent to ' +
              $scope.email +
              '. Please follow the instructions there to change your password',
            title: 'Password change request done'
          });

          if (localStorageService.get('name')) {
            $uibModalInstance.close('logout');
          } else {
            $uibModalInstance.close();
          }
        })
        .catch(function(error) {
          $scope.loading = false;

          console.error(error);
          $scope.error = error.data.message;
        });
    };

    $scope.$watch('phone', function(newValue) {
      if (newValue && newValue.toString().length === 10) {
        $scope.loading = true;

        customerService.getEmail(newValue).then(function(response) {
            console.log(response);
            $scope.email = response.data.email;
            $scope.customerId = response.data.id;
            $scope.loading = false;

          })
          .catch(function(error) {
            $scope.loading = false;

            $scope.error = error.data.message;
            console.error(error);
          });
      }
    });

  });

'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:RegistermodalCtrl
 * @description
 * # RegistermodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('RegistermodalCtrl', function($scope, $uibModalInstance, phone, customerService, loginService) {
        $scope.user = {};
        if (phone) {
            $scope.user.phone = phone;
        }
        $scope.register = function() {
            customerService.registerUser($scope.user)
                .then(function() {
                    $uibModalInstance.close();
                }).catch(function(error) {
                    console.log(error);
                    $scope.error = error;
                    $uibModalInstance.dismiss();
                });
        };
    });
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', function($uibModal) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        this.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/loginmodal.html',
                size: 'sm',
                controller:'LoginmodalCtrl',
                controllerAs:'login'
            });
        }; 
    });


'use strict';

/**
 * @ngdoc directive
 * @name chocoholicsApp.directive:compareTo
 * @description
 * # compareTo
 */
angular.module('chocoholicsApp')
  .directive('compareTo', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });

'use strict';

describe('Controller: ErrormodalCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var ErrormodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrormodalCtrl = $controller('ErrormodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ErrormodalCtrl.awesomeThings.length).toBe(3);
  });
});

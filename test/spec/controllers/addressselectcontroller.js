'use strict';

describe('Controller: AddressselectcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var AddressselectcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddressselectcontrollerCtrl = $controller('AddressselectcontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddressselectcontrollerCtrl.awesomeThings.length).toBe(3);
  });
});

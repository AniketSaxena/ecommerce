'use strict';

describe('Controller: RegistermodalCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var RegistermodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistermodalCtrl = $controller('RegistermodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RegistermodalCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: PasswordchangeCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var PasswordchangeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordchangeCtrl = $controller('PasswordchangeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PasswordchangeCtrl.awesomeThings.length).toBe(3);
  });
});

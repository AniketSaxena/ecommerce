'use strict';

describe('Controller: AsidectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var AsidectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AsidectrlCtrl = $controller('AsidectrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AsidectrlCtrl.awesomeThings.length).toBe(3);
  });
});

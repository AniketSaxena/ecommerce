'use strict';

describe('Controller: ShopCtrl', function () {

  // load the controller's module
  beforeEach(module('chocoholicsApp'));

  var ShopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShopCtrl = $controller('ShopCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ShopCtrl.awesomeThings.length).toBe(3);
  });
});

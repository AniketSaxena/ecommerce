'use strict';

describe('Service: orderServices', function () {

  // load the service's module
  beforeEach(module('chocoholicsApp'));

  // instantiate service
  var orderServices;
  beforeEach(inject(function (_orderServices_) {
    orderServices = _orderServices_;
  }));

  it('should do something', function () {
    expect(!!orderServices).toBe(true);
  });

});

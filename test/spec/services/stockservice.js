'use strict';

describe('Service: stockservice', function () {

  // load the service's module
  beforeEach(module('chocoholicsApp'));

  // instantiate service
  var stockservice;
  beforeEach(inject(function (_stockservice_) {
    stockservice = _stockservice_;
  }));

  it('should do something', function () {
    expect(!!stockservice).toBe(true);
  });

});

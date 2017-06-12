'use strict';

describe('Service: loginservice', function () {

  // load the service's module
  beforeEach(module('chocoholicsApp'));

  // instantiate service
  var loginservice;
  beforeEach(inject(function (_loginservice_) {
    loginservice = _loginservice_;
  }));

  it('should do something', function () {
    expect(!!loginservice).toBe(true);
  });

});

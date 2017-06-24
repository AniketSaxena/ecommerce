'use strict';

describe('Service: addressSelectModal', function () {

  // load the service's module
  beforeEach(module('chocoholicsApp'));

  // instantiate service
  var addressSelectModal;
  beforeEach(inject(function (_addressSelectModal_) {
    addressSelectModal = _addressSelectModal_;
  }));

  it('should do something', function () {
    expect(!!addressSelectModal).toBe(true);
  });

});

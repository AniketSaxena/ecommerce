'use strict';

describe('Directive: imgLoading', function () {

  // load the directive's module
  beforeEach(module('chocoholicsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<img-loading></img-loading>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imgLoading directive');
  }));
});

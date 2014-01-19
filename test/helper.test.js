var should = require('should');
var helper = require('../lib/helper');

describe('helper', function () {
  xit('getUserHome', function () {
    helper.getUserHome().should.be.equal('');
  });

  it('fetchName', function () {
    helper.fetchName('http://url.com/filename.mp3').should.be.equal('filename.mp3');
    helper.fetchName('http://url.com/filename.mp3?xcode=xxx').should.be.equal('filename.mp3');
  });
});

var path = require('path');
var os = require('os');
var fs = require('fs');

var should = require('should');
var IPod = require('../');

describe('new IPod', function () {
  it('new IPod([], {})', function () {
    var ipod = new IPod(['url'], {mode: 'random'});
    ipod.list.should.be.eql(['url']);
    ipod.mode.should.be.equal('random');
  });

  it('new IPod([])', function () {
    var ipod = new IPod(['url']);
    ipod.list.should.be.eql(['url']);
    ipod.mode.should.be.equal('loop');
  });

  it('new IPod()', function () {
    var ipod = new IPod();
    ipod.list.should.be.eql([]);
    ipod.mode.should.be.equal('loop');
  });

  it('new IPod(song)', function () {
    var ipod = new IPod('url');
    ipod.list.should.be.eql(['url']);
    ipod.mode.should.be.equal('loop');
  });

  it('new IPod({})', function () {
    var ipod = new IPod({mode: 'random'});
    ipod.list.should.be.eql([]);
    ipod.mode.should.be.equal('random');
  });
});

describe('download', function () {
  var filepath = path.join(os.tmpdir(), 'cached_file');

  beforeEach(function (done) {
    fs.unlink(filepath, function () {
      done();
    });
  });
  var ipod = new IPod();
  it('download error url', function (done) {
    ipod.download('http://some.url/filename.mp3', filepath, function (err) {
      should.exist(err);
      err.should.have.property('message', 'getaddrinfo ENOTFOUND');
      done();
    });
  });

  it('download 404 url', function (done) {
    var url = 'http://html5ify.qiniudn.com/404.mp3';
    ipod.download(url, filepath, function (err) {
      should.exist(err);
      err.should.have.property('message', 'resource invalid');
      done();
    });
  });

  it('download html url', function (done) {
    var url = 'http://www.baidu.com/';
    ipod.download(url, filepath, function (err) {
      should.exist(err);
      err.should.have.property('message', 'resource type is unsupported');
      done();
    });
  });

  it('download ok url', function (done) {
    var url = 'http://html5ify.qiniudn.com/demo.mp3';
    ipod.download(url, filepath, function (err, readable) {
      should.not.exist(err);
      readable.should.have.property('readable', true);
      done();
    });
  });
});

describe('nextSong', function () {
  var list = ['1', '2', '3', '4', '5'];
  
  it('loop mode', function () {
    var ipod = new IPod(list, {mode: 'loop'});
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(0);
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(1);
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(2);
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(3);
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(4);
    ipod.nextSong();
    ipod.currentIndex.should.be.equal(0);
  });

  it('random mode', function () {
    var ipod = new IPod(list, {mode: 'random'});
    var order = [];
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    // 这样的概率应该很小才是
    order.should.not.eql([0, 1, 2]);
  });

  it('order mode', function () {
    var ipod = new IPod(list, {mode: 'order'});
    var order = [];
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    ipod.nextSong();
    order.push(ipod.currentIndex);
    // 这样的概率应该很小才是
    order.should.be.eql([0, 1, 2, 3, 4, 5]);
  });
});

describe('add', function () {
  var list = ['1', '2'];

  it('should ok', function () {
    var ipod = new IPod(list);
    ipod.add('hehe');
    ipod.list.should.be.eql(['1', '2', 'hehe']);
  });
});

describe('addFolder', function () {
  it('should ok', function (done) {
    var ipod = new IPod();
    ipod.addFolder(path.join(__dirname, '../demo'), function (err) {
      should.not.exist(err);
      ipod.list.should.have.length(2);
      done();
    });
  });

  it('should not ok', function (done) {
    var ipod = new IPod();
    ipod.addFolder(path.join(__dirname, '../inexist'), function (err) {
      should.exist(err);
      err.should.have.property('code', 'ENOENT');
      done();
    });
  });
});

describe('read', function () {
  it('should be ok', function (done) {
    var ipod = new IPod();
    ipod.read(path.join(__dirname, '../demo/demo.mp3'), function (err, readable) {
      should.not.exist(err);
      readable.should.have.property('readable', true);
      done();
    });
  });

  describe('read from net', function () {
    before(function (done) {
      fs.unlink(path.join(os.tmpdir(), 'demo.mp3'), function () {
        done();
      });
    });

    it('should be ok with net', function (done) {
      var ipod = new IPod(  {
        downloads: os.tmpdir()
      });
      var url = 'http://html5ify.qiniudn.com/demo.mp3';
      ipod.read(url, function (err, readable) {
        should.not.exist(err);
        readable.should.have.property('readable', true);
        done();
      });
    });

    it('should be ok with cache', function (done) {
      var ipod = new IPod(  {
        downloads: path.join(__dirname, '../demo')
      });
      var url = 'http://some.url/demo.mp3';
      ipod.read(url, function (err, readable) {
        should.not.exist(err);
        readable.should.have.property('readable', true);
        done();
      });
    });
  });
});

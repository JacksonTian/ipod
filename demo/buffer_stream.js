var lame = require('lame');
var Speaker = require('speaker');

var stream = require('stream');
var util = require('util');
var http = require('http');
var fs = require('fs');
var Writable = stream.Writable;

function Pool(opt) {
  Writable.call(this, opt);
  this.buffers = [];
  this.dists = [];
  var that = this;
  this.on('drain', function () {
    if (that.dists.length) {
      var buf = that.buffers.shift();
      if (buf) {
        that._flush(buf);
      }
    }
  });

  this.on('finish', function () {
    if (that.dists.length) {
      var buf;
      while ((buf = that.buffers.shift())) {
        that._flush(buf);
      }
      that._end();
    }
  });
}

util.inherits(Pool, Writable);

Pool.prototype._write = function (chunk, encoding, done) {
  this.buffers.push(chunk);
  done();
};

Pool.prototype._flush = function (chunk) {
  this.dists.forEach(function (dist) {
    dist.write(chunk);
  });
};
Pool.prototype._end = function () {
  this.dists.forEach(function (dist) {
    dist.end();
  });
};

Pool.prototype.pipe = function (dist) {
  this.dists.push(dist);
  return dist;
};

var src = 'http://zhangmenshiting.baidu.com/data2/music/64022204/73383361390489261128.mp3?xcode=6e2e952fc4b13423efa82c018e4ac7c5ec0497093d29d6f3';
http.get(src, function (res) {
  console.log(res.headers);
  if (res.statusCode !== 200) {
    console.log(new Error('资源响应错误'));
    return;
  }

  var pool = new Pool();
  var wr = fs.createWriteStream(__dirname + '/demo3.mp3');
  console.time('res');
  console.time('bs');
  var decoder = new lame.Decoder();
  var speaker = new Speaker();
  res.pipe(pool).pipe(decoder).pipe(speaker);
  pool.pipe(wr);
  wr.on('data', function (buf) {
    console.log('wr data, length: ', buf.length);
  });
  wr.on('end', function () {
    console.log('wr end', new Date());
  });
  res.on('end', function () {
    console.log('res end');
  });
  pool.on('data', function (buf) {
    console.log('bs data, length: ', buf.length);
  });
  pool.on('end', function () {
    console.log('bs end', new Date());
  });
  pool.on('finish', function() {
    console.log('bs finish', new Date());
  });
  decoder.on('finish', function () {
    console.log('decoder finish', new Date());
  });
  decoder.on('end', function () {
    console.log('decoder end', new Date());
  });
  speaker.on('close', function () {
    console.log('speaker close', new Date());
  });
  speaker.on('end', function () {
    console.log('speaker end', new Date());
  });
});

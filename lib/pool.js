var stream = require('stream');
var util = require('util');
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

module.exports = Pool;

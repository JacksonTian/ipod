var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

var getUrlLib = function (url) {
  if (url.indexOf('https') !== -1) {
    return require('https');
  }
  return require('http');
};

var src = 'http://zhangmenshiting.baidu.com/data2/music/64022204/73383361390489261128.mp3?xcode=6e2e952fc4b13423efa82c018e4ac7c5ec0497093d29d6f3';
var urllib = getUrlLib(src);
var request = urllib.get(src, function (res) {
  if (res.statusCode !== 200) {
    console.log(new Error('资源响应错误'));
    return;
  }
  console.log(res.headers);
  console.log("Got response: " + res.statusCode);
  var writer = fs.createWriteStream('./demo3.mp3');
  res.pipe(writer);
  console.time('res');
  var count = 0;
  res.on('data', function () {
    count++;
  });
  res.on('end', function () {
    console.timeEnd('res');
    console.log(count);
  });
  res.on('close', function () {
    console.log('res close', new Date());
  });
  writer.on('finish', function() {
    console.error('all writes are now complete.', new Date());
  });
  var decoder = new lame.Decoder();
  // var speaker = new Speaker();
  res.pipe(decoder);
  // decoder.pipe(speaker);
  // decoder.on('end', function () {
  //   console.log('decoder end', new Date());
  // });
  // speaker.on('close', function () {
  //   console.log('speaker close', new Date());
  // });
});

request.on('error', function(e) {
  console.log(e);
  console.log("Got error: " + e.message);
});

// Content-Disposition:attachment; filename="ÎÒµÄ¸èÉùÀï.mp3"
// Content-Length:3468756
// Content-MD5:1453561f58b606eb30ba7e281b039d4e
// Content-Type:audio/mpeg

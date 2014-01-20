var lame = require('lame');
var Speaker = require('speaker');

var getUrlLib = function (url) {
  if (url.indexOf('https') !== -1) {
    return require('https');
  }
  return require('http');
};

var src = 'http://zhangmenshiting.baidu.com/data2/music/10470876/7343701219600128.mp3?xcode=351634fd3718fed5abb2f9389b9d4097b9319fcd4157c2b2';
var src = 'http://zhangmenshiting.baidu.com/data2/music/33909933/31627254108000128.mp3?xcode=0bad1c5e5224e56ff31000774b753c9492822cd485d59822';
// var src = 'http://nodejs.org/api/http.html#http_http_get_options_callback';
var urllib = getUrlLib(src);
var request = urllib.get(src, function (res) {
  if (res.statusCode !== 200) {
    console.log(new Error('资源响应错误'));
    return;
  }
  console.log(res.headers);
  console.log("Got response: " + res.statusCode);
  var decoder = new lame.Decoder();
  var speaker = new Speaker();
  res.pipe(decoder).pipe(speaker);
  res.on('end', function () {
    console.log('res end', new Date());
  });
  decoder.on('end', function () {
    console.log('decoder end', new Date());
  });
  speaker.on('close', function () {
    console.log('speaker close', new Date());
  });
});

request.on('error', function(e) {
  console.log(e);
  console.log("Got error: " + e.message);
});

// Content-Disposition:attachment; filename="ÎÒµÄ¸èÉùÀï.mp3"
// Content-Length:3468756
// Content-MD5:1453561f58b606eb30ba7e281b039d4e
// Content-Type:audio/mpeg

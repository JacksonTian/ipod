var request = require('request');
var lame = require('lame');
var Speaker = require('speaker');

var src = 'http://zhangmenshiting.baidu.com/data2/music/10470876/7343701219600128.mp3?xcode=351634fd3718fed5abb2f9389b9d4097b9319fcd4157c2b2';
var src = 'http://zhangmenshiting.baidu.com/data2/music/33909933/31627254108000128.mp3?xcode=0bad1c5e5224e56ff31000774b753c9492822cd485d59822';
var res = request.get(src);
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

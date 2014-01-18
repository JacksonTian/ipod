var Player = require('../index');

// 播放
var player = new Player([
    __dirname + '/demo.mp3',
    'http://zhangmenshiting.baidu.com/data2/music/10470876/7343701219600128.mp3?xcode=351634fd3718fed5abb2f9389b9d4097b9319fcd4157c2b2',
    'http://zhangmenshiting.baidu.com/data2/music/38229860/149508041389898861128.mp3?xcode=e496d1b9d6f0f06ba529c7e803ce62d38297c919b6fadb49'
], {
    mode: 'random'
});

player.on('downloading',function (item) {
    console.log('im downloading... src:' + item);
});

player.on('downloaded',function (item) {
    console.log('downloaded... src:' + item);
});

player.on('playing',function (item) {
    console.log('im playing... src:' + item);
});

player.on('playend',function (item) {
    console.log('id:' + item + ' play done, switching to next one ...');
});

player.on('finish', function () {
    console.log('播放完了');
});

player.on('error', function(err){
    // 当流媒体出现播放错误时
    console.log('Opps... 流媒体发生错误!');
    console.log(err);
});

player.play();

setTimeout(function () {
    player.next();
}, 10000);


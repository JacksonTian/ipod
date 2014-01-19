var Player = require('../');
var player = new Player([], {
  mode: 'random'
});
player.addFolder('/Users/jacksontian/douban.fm', function (err) {
  console.log(arguments);
  if (err) {
    console.log(err);
  }
  player.play();
});

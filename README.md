## I love iPod ![](https://badge.fury.io/js/ipod.png)

a cli wrapper of node-speaker, support play `.mp3`s both from url and local songs.

### Installation

````
$ npm install ipod
````

### Example

````javascript
var IPod = require('ipod');

// create ipod instance
var ipod = new IPod('./xxx.mp3');

// play now and callback when playend
ipod.play();

// create a player instance from playlist
var ipod = Player([
    __dirname + '/demo.mp3',
    __dirname + '/demo2.mp3',
    __dirname + '/demo.mp3',
    // play .mp3 file from a URL
    'http://mr4.douban.com/blablablabla/p1949332.mp3'
]);

// play again
ipod.play();

// play the next song, if any
ipod.next();

// add another song to playlist
ipod.add('http://someurl.com/anothersong.mp3');

// event: on playing
ipod.on('playing',function(item){
  console.log('im playing... src:' + item);
});

// event: on playend
ipod.on('playend',function(item){
  // return a playend item
  console.log('src:' + item + ' play done, switching to next one ...');
});

// event: on error
ipod.on('error', function(err){
  // when error occurs
  console.log(err);
});

// stop playing
ipod.stop();
````

### Have a try

```bash
$ npm install ipod -g
$ cd music_folder
$ ipod .
$ # random mode
$ ipod . --mode random
```

### MIT license
Copyright (c) 2014 Jackson Tian <shyvo1987@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

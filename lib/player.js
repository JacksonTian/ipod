'use strict';

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const httpx = require('httpx');
const os = require('os');
const url = require('url');

const lame = require('lame');
const Speaker = require('speaker');
const PoolStream = require('pool_stream');
const debug = require('debug')('ipod');

function fsexists(filepath) {
  return new Promise((resolve) => {
    fs.exists(filepath, function (exists) {
      resolve(exists);
    });
  });
}

function readFile(filepath) {
  return fsexists(filepath).then((exists) => {
    if (!exists) {
      return Promise.reject(new Error(`${filepath} is not exists.`));
    }

    return fs.createReadStream(filepath);
  });
}

/**
 * 播放器构造函数
 */

class Player extends EventEmitter {
  constructor(songs, options) {
    super();
    songs = typeof songs === 'string' ? [songs] : songs;
    if (!Array.isArray(songs)) {
      options = songs;
      songs = [];
    }
    this.list = songs || [];
    options = options || {};
    this.mode = options.mode || 'loop';
    this.downloads = options.downloads || path.join(os.homedir(), '.player');
    this.currentIndex = -1;
  }

  play() {
    var src = this.nextSong();
    if (!src) {
      // 演出结束
      debug('finishing');
      this.emit('finish');
      this.currentIndex = -1;
      return;
    }
    var self = this;
    this.read(src).then((readable) => {
      var decoder = new lame.Decoder();
      var speaker = new Speaker();
      this.currentDecoder = decoder;
      this.currentSpeaker = speaker;
      this.currentStream = readable;
      readable.pipe(decoder).pipe(speaker);
      this.emit('playing', src);
      debug('playing. src is %s', src);
      speaker.on('close', function () {
        debug('speaker close. src is %s', src);
        self.emit('playend', src);
        // 继续播放
        self.play();
      });

      readable.on('error', function (err) {
        debug('readable error. src is %s', src);
        self.emit('error', err);
        // 继续播放
        self.play();
      });
    }, (err) => {
      debug('reading resource err. src is %s', src);
      this.emit('error', err);
      // 继续播放
      this.play();
    });
  }

  next() {
    this.stop();
    this.play();
  }

  nextSong() {
    switch (this.mode) {
    case 'loop':
      this.currentIndex++;
      if (this.currentIndex >= this.list.length) {
        this.currentIndex = 0;
      }
      break;
    case 'random':
      this.currentIndex = Math.floor(Math.random() * this.list.length);
      break;
    }

    return this.list[this.currentIndex];
  }

  add(song) {
    this.list.push(song);
  }

  /**
   * 停止当前歌曲
   */
  stop() {
    if (this.currentSpeaker) {
      this.currentSpeaker.removeAllListeners('close');
      this.currentSpeaker.end();
    }
  }

  /**
   * 下载歌曲
   */
  download(src, cached) {
    return httpx.request(src).then((res) => {
      // 检查状态码
      if (res.statusCode !== 200) {
        return Promise.reject(new Error('resource invalid'));
      }

      // 检查类型
      if (res.headers['content-type'].indexOf('audio/mpeg') === -1) {
        return Promise.reject(new Error('resource type is unsupported'));
      }

      // 创建pool
      var pool = new PoolStream();
      debug('downloading %s', src);
      this.emit('downloading', src);
      // 管道
      res.pipe(pool);
      // 创建只写流
      var writable = fs.createWriteStream(cached);
      pool.pipe(writable);

      return pool;
    });
  }

  /**
   * 从src读取内容，如果是网络内容，返回网络下载流；如果是磁盘文件，返回只读流
   */
  read(src) {
    // 从磁盘读
    if (!src.startsWith('http')) {
      return readFile(src);
    }

    // 获取文件名
    var pathname = url.parse(src).pathname;
    var filename = path.basename(pathname);

    // 缓存的目标文件名
    var cached = path.join(this.downloads, filename);
    return fsexists(cached).then((exists) => {
      if (exists) {
        // 从本地播放
        return fs.createReadStream(cached);
      }
      // 从网络下载
      return this.download(src, cached);
    });
  }

}

module.exports = Player;

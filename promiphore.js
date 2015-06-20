/*
** © 2015 by Philipp Dunkel <pip@pipobscure.com>
** Licensed under MIT License
*/

module.exports = exports = promiphore;

var path = require('path');
var fs = require('fs');
var fsext = require('fs-ext');
var crypto = require('crypto');

var tmpdir = require('os').tmpdir();

function promiphore(name, timeout, retryfn) {
  var id = crypto.createHash('SHA1').update(name).digest('hex');
  var fname = path.resolve(tmpdir, ['promiphore',id].join('-'));
  return open(fname).then(function(fd) {
    return lock(fd, timeout, retryfn || setImmediate).then(function(fd) {
      return done.bind(null, fd, fname);
    }).catch(function(err) {
      return close(fd).then(function() {
        return unlink(fname).then(function() {
          throw err;  
        });
      });
    });
  });
}
function open(fname) {
  return new Promise(function(resolve, reject) {
    fs.open(fname, 'w', function(err, fd) {
      if (err) return reject(err);
      return resolve(fd);
    });
  });
}
function lock(fd, timeout, retryfn) {
  var instance = {}, started = Date.now();
  return new Promise(function(resolve, reject) {
    runner();
    function runner() {
      tryLock(fd).then(resolve, catcher);
    }
    function catcher(err) {
      if (err.errno !== 35) return reject(err);
      if (timeout && ((Date.now()-started)>timeout)) return reject(err);
      retryfn.call(instance, runner);
    }
  });
}
function tryLock(fd) {
  return new Promise(function(resolve, reject) {
    fsext.flock(fd, 'exnb', function(err) {
      if (err) return reject(err);
      return resolve(fd);
    });
  });
}
function unlock(fd) {
  return new Promise(function(resolve, reject) {
    fsext.flock(fd, 'un', function(err) {
      if (err) return reject(err);
      return resolve(fd);
    });
  });
}
function close(fd) {
    return new Promise(function(resolve, reject) {
      fs.close(fd, function(err) {
        if (err) return reject(err);
        return resolve();
      });
    });
}
function unlink(fname) {
  return new Promise(function(resolve) {
    fs.unlink(fname, resolve);
  });
}
function done(fd, fname) {
  return unlock(fd).then(function(fd) {
    return close(fd).then(function() {
      return unlink(fname);
    });
  }).catch(function(err) {
    close(fd).then(function() {
      throw err;
    }).catch(function() {
      return unlink(fname).then(function() {
        throw err;
      });
    });
  }); 
}

/*
** The MIT License (MIT)
** 
** Copyright (c) 2015 Philipp Dunkel
** 
** Permission is hereby granted, free of charge, to any person obtaining a copy
** of this software and associated documentation files (the "Software"), to deal
** in the Software without restriction, including without limitation the rights
** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
** copies of the Software, and to permit persons to whom the Software is
** furnished to do so, subject to the following conditions:
** 
** The above copyright notice and this permission notice shall be included in all
** copies or substantial portions of the Software.
** 
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
** SOFTWARE.
*/

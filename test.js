/*
** © 2015 by Philipp Dunkel <pip@pipobscure.com>
** Licensed under MIT License
*/

var tap = require('tap');
var promiphore = require('./promiphore');
var fs = require('fs');
var os = require('os');

tap.comment('TempDir: '+os.tmpdir());
/*
tap.test('concurrent', function (t) {
  var complete = 0;
  var running = 0;
  var starting = 10;
  var delay = 5;
  var resource = 'test-concurrent';

  t.plan((starting * 2) + 2);

  var all=[];
  for (var cnt=0; cnt<starting; cnt++) {
    all[cnt]=promiphore(resource).then(locked, error);
  }
  function locked(unlock) {
    return new Promise(exec).then(finish);
    function exec(resolve, reject) {
      running++;
      t.equal(1, running, 'there should be 1 processing only');
      setTimeout(done, delay);
      function done() {
        running--;
        t.equal(0, running, 'there should be none processing');
        unlock().then(resolve, reject);
      }
    }
    function finish() {
      complete++;
    }
  }
  function error(err) {
    t.on(false, err.message);
  }

  Promise.all(all).then(function() {
    t.equal(0, running, 'there should be none processing');
    t.equal(starting, complete, 'all are done');
    t.end();
  });
});
*/
tap.test('timeout', function(t) {
  t.plan(1);
  var resource = 'test-timeout';
  promiphore(resource).then(function(done) {
    return promiphore(resource, 1000).then(function(unlock) {
      t.ok(false, 'this.should never be reached');
      unlock();
    }, function(err) {
      t.ok((err.code+'') === 'EAGAIN', 'this should timeout to EAGAIN not '+[err.errno,err.code,err.message].join('|'));
    }).then(done);
  }).then(function() {
    t.end();
  }, function(err) {
    t.on(false, err.message);
  });
});

/*
tap.test('retry', function(t) {
  var resource = 'test-retry';
  var retries = 10;
  var tries = 0;
  t.plan(retries + 2);
  promiphore(resource).then(function(done) {
    return promiphore(resource, 0, retry).then(function(unlock) {
      t.ok(true, 'complete');
      return unlock();
    }, function(err) {
      t.ok(false, 'unexpected error');
    });
    function retry(fn) {
      if (!tries) {
        t.ok(!this.tries, 'good: no tries yes');
      } else {
        t.ok(this.tries === tries, 'good: storing state works');
      }
      this.tries = (tries += 1);
      setTimeout(fn, 100);
      if (tries === retries) done();
    }
  }).then(function() {
    t.ok(tries === retries, 'retried correct number of times');
    t.end();
  }, function(err) {
    t.on(false, err.message);
  });
});
*/

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

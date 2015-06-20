var tap = require('tap');
var pp = require('./promiphore');
var log = console.error.bind(console);

tap.test('concurrent', function (t) {
  var complete = 0;
  var running = 0;
  var starting = 10;
  var delay = 5;
  var resource = 'test';

  t.plan((starting * 2) + 2);

  var all=[];
  for (var cnt=0; cnt<starting; cnt++) {
    all[cnt]=pp(resource).then(function(unlock) {
      return new Promise(function(resolve, reject) {
        running++;
        t.equal(1, running, 'there should be 1 processing only');
        setTimeout(function() {
          running--;
          t.equal(0, running, 'there should be none processing');
          unlock().then(resolve, reject);
        }, delay);
      }).then(function() {
        complete++;
      });
    });
  }

  Promise.all(all).then(function() {
    t.equal(0, running, 'there should be none processing');
    t.equal(starting, complete, 'all are done');
    t.end();
  })
});


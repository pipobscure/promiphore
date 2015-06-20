# PromiPhore

[![Build Status](https://secure.travis-ci.org/pipobscure/promiphore.png)](http://travis-ci.org/#!/pipobscure/promiphore)

This is a simple mechanism to lock resources and control simultaneous access to them. It uses flock file-locking and promises to ensure that only one action is ever accessing a resource.

## Install

    npm install --save promiphore

## Example

    var promiphore = require('promiphore');

    promiphore('resource-name').then(function(unlock) {
      console.log('locked');
      setTimeout(function() {
        console.log('unlock');
        unlock();
      }, 1000);
    });
    promiphore('resource-name').then(function(unlock) {
      console.log('locked');
      setTimeout(function() {
        console.log('unlock');
        unlock();
      }, 1000);
    });

### PromiPhore(resourceName[, timeout[, retryFunction]])

#### Parameters

 * **resourceName** - a unique name that is used to uniquely identify the resource. This is the key used to decide who to wait for.
 * **timeout** - milliseconds before the attempt to get the resource is stopped (EAGAIN will be the error)
 * **retryFunction** - a function that is used to retry lock aquisition. It will be passed a function to execute after a timeout. The *this* will be set to a plain object that can be used to store data between calls. This can be used to achieve an incremental backoff. By default setImmediate is used.

#### Return Value

The function returns a Promise that resolves to a function which can be used to unlock the semaphore.

## License

The MIT License (MIT)

Copyright (c) 2015 Philipp Dunkel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

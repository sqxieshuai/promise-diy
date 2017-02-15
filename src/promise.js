
var utils = require("./utils");
utils.debug(true);
var log = utils.log;

var STATUS = {
  PENDING: 0,
  RESOLVED: 1,
  REJECTED: 2
};

function Promise(executor) {
  log("call Promise constructor.");
  if (typeof executor != "function") {
    throw new TypeError("Promise 构造函数的第一个参数需要是一个函数.");
  }

  var self = this;
  this.status = STATUS.PENDING;
  this.value = undefined;
  this.resolveCbs = [];
  this.rejectCbs = [];

  function resolve(value) {
    log("call Promise resolve.");
    //setTimeout 创建一个 macro-task, 确保所有 micro-task 执行完才会执行 resolveCbs, 这里是需要确保 promise 的 then 或 catch 方法被执行
    setTimeout(function () {
      if (self.status == STATUS.PENDING) {
        self.status = STATUS.RESOLVED;
        self.value = value;

        //当 promise 成功执行时，所有 resolveCb 需按照其注册顺序依次回调
        for (var i = 0; i < self.resolveCbs.length; i++) {
          self.resolveCbs[i](self.value);
        }
      }
    },  0);
  }
  function reject(reason) {
    log("call Promise reject.");
    setTimeout(function () {
      if (self.status == STATUS.PENDING) {
        self.status = STATUS.REJECTED;
        self.value = reason;

        //当 promise 被拒绝执行时，所有的 rejectCb 需按照其注册顺序依次回调
        for (var i = 0; i < self.rejectCbs.length; i++) {
          self.rejectCbs[i](self.value);
        }
      }
    }, 0);
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.resolve = function (value) {
  return new Promise(function (resolve) {
    resolve(value);
  });
};

Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};

Promise.done = function(){
  return new Promise(function (){});
};

Promise.all = function (promises) {
  return new Promise(function (resolve, reject) {
    var promisesNum = promises.length;
    var resolvedNum = 0;
    var resolvedValue = new Array(promisesNum);
    for (var i = 0; i < promisesNum; i++) {
      (function (i) {
        Promise.resolve(promises[i]).then(
          function (value) {
            resolvedNum++;
            resolvedValue[i] = value;
            if (resolvedNum == promisesNum) {
              return resolve(resolvedValue);
            }
          },
          function (reason) {
            return reject(reason);
          }
        );
      })(i);
    }
  });
};

Promise.prototype.then = function (resolveCb, rejectCb) {
  log("call Promise.prototype.then.");
  resolveCb = typeof resolveCb == "function" ? resolveCb : function (v) { return v; };
  rejectCb = typeof rejectCb == "function" ? rejectCb : function (r) { throw r; };
  var self = this;
  var value, promise;

  //status 为 pending 的时候
  if (self.status == STATUS.PENDING) {
    promise = new Promise(function (resolve, reject) {
      log("push resolveCb to resolveCbs.");
      self.resolveCbs.push(function () {
        try {
          value = resolveCb(self.value);
          _resolve(promise, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      log("push rejectCb to rejectCbs.");
      self.rejectCbs.push(function () {
        try {
          value = rejectCb(self.value);
          _resolve(promise, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  //status 为 resolved 的时候
  if (self.status == STATUS.RESOLVED) {
    promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          value = resolveCb(self.value);
          _resolve(promise, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    });
  }

  //status 为 rejected 的时候
  if (self.status == STATUS.REJECTED) {
    promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          value = rejectCb(self.value);
          _resolve(promise, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    });
  }

  //then 方法必须返回一个 promise 对象
  return promise;
};

Promise.prototype.reject = function (rejectCb) {
  log("call Promise.prototype.reject.");
  this.then.call(this, undefined, rejectCb);
};

function _resolve(promise, value, resolve, reject) {

  var then, thenResolvedOrRejected = false;

  //情况一, promise 和 value 的值相等
  if (promise === value) {
    reject(new TypeError("promise 参数错误,产生循环."));
  }

  //情况二,value 是一个 Promise 实例
  if (value instanceof Promise) {
    //value 处于 pending 状态
    if (value.status == STATUS.PENDING) {
      value.then(
        function (v) {
          _resolve(promise, v, resolve, reject);
        },
        reject
      );
    } else {
      //value 处于 resolved/rejected 状态
      value.then(resolve, reject);
    }
  }

  //情况三, value 的类型是对象或方法
  if (value != null && (typeof value == "object" || typeof value == "function")) {
    try {
      then = value.then;
      if (typeof then == "function") {
        then.call(
          value,
          function resolvePromise(v) {
            if (thenResolvedOrRejected == false) {
              thenResolvedOrRejected = true;
              _resolve(promise, v, resolve, reject);
            }
          },
          function rejectPromise(r) {
            if (thenResolvedOrRejected == false) {
              thenResolvedOrRejected = true;
              reject(r);
            }
          }
        );
      } else {
        resolve(value);
      }
    } catch (e) {
      if (thenResolvedOrRejected == false) {
        thenResolvedOrRejected = true;
        reject(e);
      }
    }
  } else {
    resolve(value);
  }
}

Promise.deferred = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
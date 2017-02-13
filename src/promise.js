
var STATUS = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
};

function Promise(executor) {
  if (typeof executor != "function") {
    throw new Error("Promise 的第一个参数必须是函数.");
  }

  console.log("call Promise constructor.");

  var self = this;
  this.status = STATUS.PENDING;
  this.data = undefined;
  this.resolveCbs = [];
  this.rejectCbs = [];

  function resolve(value) {
    console.log("call Promise resolve.");
    if (self.status == STATUS.PENDING) {
      self.status = STATUS.RESOLVED;
      self.data = value;

      for (var i = 0; i < self.resolveCbs.length; i++) {
        self.resolveCbs[i](value);
      }
    }
  }
  function reject(reason) {
    console.log("call Promise reject.");
    if (self.status == STATUS.PENDING) {
      self.status = STATUS.REJECTED;
      self.data = reason;

      for (var i = 0; i < self.rejectCbs.length; i++) {
        self.rejectCbs[i](reason);
      }
    }
  }

  executor(resolve, reject);
}

Promise.prototype.then = function (resolveCb, rejectCb) {
  console.log("call Promise.prototype.then.");
  if (typeof resolveCb == "function") {
    console.log("push resolveCb to resolveCbs.");
    this.resolveCbs.push(resolveCb);
  }
  if (typeof rejectCb == "function") {
    console.log("push rejectCb to rejectCbs.");
    this.rejectCbs.push(rejectCb);
  }
  return this;
};

Promise.prototype.reject = function (rejectCb) {
  console.log("call Promise.prototype.reject.");
  this.then.call(this, undefined, rejectCb);
};


module.exports = Promise;
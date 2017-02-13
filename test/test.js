
var Promise = require("../src/promise");

new Promise(function (resolve, reject) {
  console.log("args ", arguments);
  setTimeout(function () {
    console.log("call setTimeout function.");
    // resolve("resolve from promise.");
    reject(new Error("no value can resolve."))
  }, 1000);
}).then(
  function resolveCb(data) {
    console.log("log data from then resolve cb: ", data);
  },
  function rejectCb(reason) {
    if (typeof reason == "object") {
      reason = reason.message;
    }
    console.log("log reason from then reject cb: ", reason);
  }
);
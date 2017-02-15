
var Promise = require("../src/promise");

var promise = new Promise(function (resolve, reject) {
  console.log("args ", arguments);
  setTimeout(function () {
    console.log("call setTimeout function.");
    resolve("resolve from promise1.");
    // resolve("resolve from promise2.");
    // reject(new Error("no value can resolve."));
  }, 1000);
  // console.log("resolve immediately.");
  // resolve("resolve from promise immediately.");
});

promise.then(
  function (data) {
    console.log("log data from then resolve cb1: ", data);
  },
  function (reason) {
    if (typeof reason == "object") {
      reason = reason.message;
    }
    console.log("log reason from then reject cb1: ", reason);
  }
);

// promise.then(
//   function (data) {
//     console.log("log data from then resolve cb2: ", data);
//   },
//   function (reason) {
//     if (typeof reason == "object") {
//       reason = reason.message;
//     }
//     console.log("log reason from then reject cb2: ", reason);
//   }
// );
// var Promise = require("../src/promise");
var Promise = require("./Promise3");

// var promise = new Promise(function (resolve, reject) {
//   console.log("args ", arguments);
//   setTimeout(function () {
//     console.log("call setTimeout function.");
//     resolve("resolve from promise1.");
//     // resolve("resolve from promise2.");
//     // reject(new Error("no value can resolve."));
//   }, 1000);
//   // console.log("resolve immediately.");
//   // resolve("resolve from promise immediately.");
// });

// promise.then(
//   function (data) {
//     console.log("log data from then resolve cb1: ", data);
//   },
//   function (reason) {
//     if (typeof reason == "object") {
//       reason = reason.message;
//     }
//     console.log("log reason from then reject cb1: ", reason);
//   }
// );

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


//--- 测试三
// setTimeout(function () {
//   console.log(1);
// }, 0);
// new Promise(function executor(resolve) {
//   console.log(2);
//   for (var i = 0; i < 10000; i++) {
//     i == 9999 && resolve();
//   }
//   console.log(3);
// }).then(function () {
//   console.log(4);
// });
// console.log(5);

// console.log("//------");

//-- 测试四
var p3 = new Promise(function (resolve, reject) {
  resolve("B");
});
var p1 = new Promise(function (resolve, reject) {
  resolve(p3);
});
var p2 = new Promise(function (resolve, reject) {
  resolve("A");
});
p1.then(function (v) {
  console.log(v);
});
p2.then(function (v) {
  console.log(v);
});
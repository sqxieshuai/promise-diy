
var _debug = false;

module.exports.debug = function (isDebug) {
  _debug = isDebug == true;
};

module.exports.log = function () {
  if (_debug == true) {
    console.log.apply(console, arguments);
  }
};
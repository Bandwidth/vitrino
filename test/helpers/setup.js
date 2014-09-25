"use strict";
var Browser = require("zombie");
var Driver  = require("./driver");
var Good    = require("good");
var Lab     = require("lab");
var Mummy   = require("mummy");
var Path    = require("path");
var script  = exports.lab = Lab.script();
var Sinon   = require("sinon");

var after  = script.after;
var before = script.before;

var good;

before(function (done) {
  var lib      = Path.join(__dirname, "..", "..", "lib");
  var plugins  = Path.join(lib, "plugins");
  var manifest = Path.join(lib, "server.json");

  // Suppress log messages during testing.
  good = Sinon.stub(Good, "register").callsArg(2);

  Mummy.extend(manifest, plugins, done);
  Browser.extend(Driver.extend);
});

after(function (done) {
  good.restore();
  done();
});

"use strict";
var Browser = require("zombie");
var Driver  = require("./driver");
var Lab     = require("lab");
var mummy   = require("mummy");
var path    = require("path");
var script  = exports.lab = Lab.script();

var before   = script.before;

before(function (done) {
  var lib      = path.join(__dirname, "..", "..", "lib");
  var plugins  = path.join(lib, "plugins");
  var manifest = path.join(lib, "server.json");

  mummy.extend(manifest, plugins, done);
  Browser.extend(Driver.extend);
});

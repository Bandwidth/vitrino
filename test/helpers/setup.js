"use strict";
var Browser     = require("zombie");
var Driver      = require("./driver");
var Environment = require("apparition").Environment;
var GitHub      = require("./github");
var Good        = require("good");
var Lab         = require("lab");
var Mummy       = require("mummy");
var Nock        = require("nock");
var Path        = require("path");
var script      = exports.lab = Lab.script();
var Sinon       = require("sinon");

var after  = script.after;
var before = script.before;

var environment;
var good;

before(function (done) {
  var lib      = Path.join(__dirname, "..", "..", "lib");
  var plugins  = Path.join(lib, "plugins");
  var manifest = Path.join(lib, "server.json");

  Nock.disableNetConnect();
  // Suppress log messages during testing.
  good = Sinon.stub(Good, "register").callsArg(2);

  // Configure the application.
  environment = new Environment();
  environment.set("organization", GitHub.organization);
  environment.set("token", GitHub.token);

  Browser.default.silent = true;
  Mummy.extend(manifest, plugins, done);
  Browser.extend(Driver.extend);
});

after(function (done) {
  environment.restore();
  good.restore();

  Nock.enableNetConnect();
  done();
});

"use strict";
var Browser = require("zombie");
var Lab     = require("lab");
var script  = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The landing page", function () {
  var browser;

  before(function (done) {
    browser = new Browser();
    browser.visit("/").nodeify(done);
  });

  // TODO: make this real...
  it("responsds", function (done) {
    expect(browser.success, "loaded").to.be.true;
    done();
  });
});

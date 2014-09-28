"use strict";
var Browser = require("zombie");
var Lab     = require("lab");
var script  = exports.lab = Lab.script();

var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("Static files", function () {
  it("are served from '/static'", function (done) {
    var browser = new Browser();

    browser.visit("/static/bootstrap/dist/css/bootstrap.min.css")
    .fail(function () {
      // Ignore errors.
    })
    .then(function () {
      expect(browser.success, "success").to.be.true;
    })
    .nodeify(done);
  });

  it("are not indexed", function (done) {
    var browser = new Browser();

    browser.visit("/static/")
    .fail(function () {
      // Ignore errors.
    })
    .then(function () {
      expect(browser.success, "success").to.be.false;
    })
    .nodeify(done);
  });
});

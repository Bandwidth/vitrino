"use strict";
var Browser = require("zombie");
var Lab     = require("lab");
var Page    = require("../helpers/pages/Page");
var script  = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The showcase client-side script", function () {
  var page;

  before(function (done) {
    var browser = new Browser();

    page = new Page(browser);
    browser.loadFixture("inactive_nav.html").nodeify(done);
  });

  it("activates the current nav", function (done) {
    expect(page.activeNav(), "active nav").to.equal("Active");
    done();
  });
});

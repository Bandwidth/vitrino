"use strict";
var Browser = require("zombie");
var Lab     = require("lab");
var Page    = require("./Page");
var script  = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The page helper", function () {
  var page;

  before(function (done) {
    var browser = new Browser();

    page = new Page(browser);
    browser.loadFixture("test_fixture.html").nodeify(done);
  });

  it("can retrieve the page title", function (done) {
    expect(page.title(), "title").to.equal("Test Fixture");
    done();
  });
});

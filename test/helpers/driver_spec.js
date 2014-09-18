"use strict";
var Browser = require("zombie");
var Driver  = require("./driver");
var Lab     = require("lab");
var script  = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The test driver", function () {
  describe("extending a browser", function () {
    var site = "http://example.com";
    var browser;

    before(function (done) {
      browser      = new Browser();
      browser.site = site;
      Driver.extend(browser);
      done();
    });

    describe("loading an HTML fixture", function () {
      before(function (done) {
        browser.loadFixture("test_fixture.html").nodeify(done);
      });

      after(function (done) {
        browser.close();
        done();
      });

      it("renders the HTML", function (done) {
        expect(browser.text("title"), "title").to.equal("Test Fixture");
        expect(browser.text("p"), "content").to.match(/test fixture/i);
        done();
      });

      it("uses the default site as the origin", function (done) {
        expect(browser.url, "url").to.match(new RegExp("^" + site));
        done();
      });
    });
  });
});

"use strict";
var Browser = require("zombie");
var Driver  = require("./driver");
var Lab     = require("lab");
var Page    = require("./pages/Page");
var Q       = require("q");
var script  = exports.lab = Lab.script();
var Sinon   = require("sinon");

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

    describe("navigating to a page", function () {
      describe("without a visit method", function () {
        var error;

        before(function (done) {
          browser.goto(Page)
          .then(
            function () {
              throw new Error("No visit method.");
            },
            function (failure) {
              error = failure;
            }
          )
          .nodeify(done);
        });

        it("fails", function (done) {
          expect(error, "type").to.be.an.instanceOf(Error);
          expect(error.message, "message").to.match(/must have a visit method/i);
          done();
        });
      });

      describe("that is not a helper", function () {
        var error;

        before(function (done) {
          browser.goto({ visit : function () {} })
          .then(
            function () {
              throw new Error("Not a helper.");
            },
            function (failure) {
              error = failure;
            }
          )
          .nodeify(done);
        });

        it("fails", function (done) {
          expect(error, "type").to.be.an.instanceOf(Error);
          expect(error.message, "message").to.match(/must be a page helper/i);
          done();
        });
      });

      describe("that is a helper with a URL", function () {
        var result;

        var TestPage = function (browser) {
          Page.call(this, browser);
        };

        TestPage.prototype = Object.create(Page.prototype);

        before(function (done) {
          TestPage.visit = Sinon.stub();
          TestPage.visit.returns(new Q());

          browser.goto(TestPage)
          .then(function (helper) {
            result = helper;
          })
          .nodeify(done);
        });

        after(function (done) {
          done();
        });

        it("returns a page helper", function (done) {
          expect(result, "helper").to.be.an.instanceOf(TestPage);
          done();
        });

        it("navigates to the page", function (done) {
          expect(TestPage.visit.callCount, "visit").to.equal(1);
          expect(TestPage.visit.calledWith(browser), "browser").to.be.true;
          done();
        });
      });
    });
  });
});

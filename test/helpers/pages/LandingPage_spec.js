"use strict";
var Browser     = require("zombie");
var Lab         = require("lab");
var LandingPage = require("./LandingPage");
var Page        = require("./Page");
var script      = exports.lab = Lab.script();
var URL         = require("url");

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("A LandingPage helper", function () {
  it("is a page helper", function (done) {
    expect(LandingPage, "type").to.be.a("function");
    expect(LandingPage.prototype, "supertype").to.be.an.instanceOf(Page);
    expect(LandingPage.visit, "visit").to.be.a("function");
    done();
  });

  it("has a title", function (done) {
    expect(LandingPage, "title").to.have.property("title", "Bandwidth Labs: Showcase");
    done();
  });

  it("has a content header", function (done) {
    expect(LandingPage, "content header")
    .to.have.property("contentHeader", "Bandwidth Labs Showcase");
    done();
  });

  describe("visiting the page", function () {
    var browser;

    before(function (done) {
      browser = new Browser();
      LandingPage.visit(browser).nodeify(done);
    });

    it("navigates to the home page", function (done) {
      expect(browser.url, "URL").to.equal(URL.resolve(browser.site, "/"));
      done();
    });
  });
});

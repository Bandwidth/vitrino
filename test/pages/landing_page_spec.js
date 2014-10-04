"use strict";
var Browser     = require("zombie");
var Lab         = require("lab");
var LandingPage = require("../helpers/pages/LandingPage");
var Page        = require("../helpers/pages/Page");
var script      = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The landing page", function () {
  var context = {
    script : script
  };

  var page;

  before(function (done) {
    var browser = new Browser();

    browser.goto(LandingPage)
    .then(function (helper) {
      page = context.page = helper;
    })
    .nodeify(done);
  });

  it("has a title", function (done) {
    expect(page.title(), "title").to.equal(LandingPage.title);
    done();
  });

  it("has a content header", function (done) {
    expect(page.contentHeader(), "content header").to.equal(LandingPage.contentHeader);
    done();
  });

  Page.describeNavbar(context, LandingPage.activeNav);
});

"use strict";
var Browser      = require("zombie");
var Lab          = require("lab");
var Page         = require("../helpers/pages/Page");
var ProjectsPage = require("../helpers/pages/ProjectsPage");
var script       = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The projects page", function () {
  var context = {
    script : script
  };

  var page;

  before(function (done) {
    var browser = new Browser();

    browser.goto(ProjectsPage)
    .then(function (helper) {
      page = context.page = helper;
    })
    .nodeify(done);
  });

  it("has a title", function (done) {
    expect(page.title(), "title").to.equal(ProjectsPage.title);
    done();
  });

  it("activates a nav element");

  Page.describeNavbar(context);
});

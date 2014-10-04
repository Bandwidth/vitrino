"use strict";
var Browser      = require("zombie");
var GitHub       = require("../helpers/github");
var Lab          = require("lab");
var Page         = require("../helpers/pages/Page");
var ProjectsPage = require("../helpers/pages/ProjectsPage");
var Q            = require("q");
var script       = exports.lab = Lab.script();
var Sinon        = require("sinon");

var after    = script.after;
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

    GitHub.setProjects(GitHub.organization, []);

    browser.goto(ProjectsPage)
    .then(function (helper) {
      page = context.page = helper;
    })
    .nodeify(done);
  });

  after(function (done) {
    GitHub.resetProjects(GitHub.organization);
    done();
  });

  it("has a title", function (done) {
    expect(page.title(), "title").to.equal(ProjectsPage.title);
    done();
  });

  Page.describeNavbar(context, ProjectsPage.activeNav);

  describe("with active projects", function () {
    it("creates an entry per project");
  });

  describe("without active projects", function () {
    var page;
    var projects;

    before(function (done) {
      var browser = new Browser();

      projects = Sinon.stub(browser.pack.plugins.github, "projects");
      projects.returns(new Q([]));

      browser.goto(ProjectsPage)
      .then(function (helper) {
        page = helper;
      })
      .nodeify(done);
    });

    after(function (done) {
      projects.restore();
      done();
    });

    it("shows a placeholder message", function (done) {
      expect(page.content(), "content").to.match(/no active projects/i);
      done();
    });
  });

  describe("with active projects", function () {
    var page;
    var projects;

    before(function (done) {
      var browser = new Browser();

      projects = Sinon.stub(browser.pack.plugins.github, "projects");
      projects.returns(new Q(
        [
          {
            avatar      : "https://github.com/images/error/octocat_happy.gif",
            description : "Pure awesomeness.",
            name        : "The Best Project Ever",
            private     : false,
            url         : "https://github.com/octocat/Hello-World"
          },

          {
            avatar      : "https://example.com/avatar.gif",
            description : "Every creature deserves a warm meal.",
            name        : "Sandwiches",
            private     : true,
            url         : "https://github.com/octocat/Sandwiches"
          }
        ]
      ));

      browser.goto(ProjectsPage)
      .then(function (helper) {
        page = helper;
      })
      .nodeify(done);
    });

    after(function (done) {
      projects.restore();
      done();
    });

    it("lists the public projects", function (done) {
      expect(page.projects(), "list").to.have.length(1);
      done();
    });

    describe("a project listing", function () {
      var project;

      before(function (done) {
        project = page.projects()[0];
        done();
      });

      it("has an avatar", function (done) {
        expect(project, "avatar")
        .to.have.property("avatar", "https://github.com/images/error/octocat_happy.gif");

        done();
      });

      it("has a name", function (done) {
        expect(project, "name").to.have.property("name", "The Best Project Ever");
        done();
      });

      it("has a description", function (done) {
        expect(project, "description").to.have.property("description", "Pure awesomeness.");
        done();
      });

      it("is linked to the project URL", function (done) {
        expect(project, "url").to.have.property("url", "https://github.com/octocat/Hello-World");
        done();
      });
    });
  });
});

"use strict";
var Browser      = require("zombie");
var GitHub       = require("../github");
var Lab          = require("lab");
var Page         = require("./Page");
var ProjectsPage = require("./ProjectsPage");
var script       = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("A project page helper", function () {
  before(function (done) {
    GitHub.setProjects(GitHub.organization, []);
    done();
  });

  after(function (done) {
    GitHub.resetProjects(GitHub.organization);
    done();
  });

  Page.isAPageHelper(script, ProjectsPage, "/projects");

  it("has a title", function (done) {
    expect(ProjectsPage, "title").to.have.property("title", "Bandwidth Labs: Projects");
    done();
  });

  it("has an active nav element", function (done) {
    expect(ProjectsPage, "active nav").to.have.property("activeNav", "Projects");
    done();
  });

  describe("parsing a project list", function () {
    var list;

    before(function (done) {
      var browser = new Browser();

      browser.loadFixture("project_list.html")
      .then(function () {
        var helper = new ProjectsPage(browser);
        list = helper.projects();
      })
      .nodeify(done);
    });

    it("creates an entry per project", function (done) {
      expect(list, "count").to.have.length(2);
      done();
    });

    it("extracts the name of the project", function (done) {
      expect(list[0], "first name").to.have.property("name", "Project 1");
      expect(list[1], "second name").to.have.property("name", "Project 2");
      done();
    });

    it("extracts the description of the project", function (done) {
      expect(list[0], "first description")
      .to.have.property("description", "The first test project.");

      expect(list[1], "second description")
      .to.have.property("description", "The second test project.");

      done();
    });

    it("extracts the URL of the project", function (done) {
      expect(list[0], "first URL").to.have.property("url", "#project1");
      expect(list[1], "second URL").to.have.property("url", "#project2");
      done();
    });

    it("extracts the avatar URL for the project", function (done) {
      expect(list[0], "first avatar").to.have.property("avatar", "avatar1.gif");
      expect(list[1], "second avatar").to.have.property("avatar", "avatar2.gif");
      done();
    });
  });
});

"use strict";
var Lab          = require("lab");
var Page         = require("./Page");
var ProjectsPage = require("./ProjectsPage");
var script       = exports.lab = Lab.script();

var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("A project page helper", function () {
  Page.isAPageHelper(script, ProjectsPage, "/projects");

  it("has a title", function (done) {
    expect(ProjectsPage, "title").to.have.property("title", "Bandwidth Labs: Projects");
    done();
  });

  it("has an active nav element", function (done) {
    expect(ProjectsPage, "active nav").to.have.property("activeNav", "Projects");
    done();
  });
});

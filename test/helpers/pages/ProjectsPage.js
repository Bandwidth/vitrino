"use strict";
var Page = require("./Page");

function ProjectsPage (browser) {
  Page.call(this, browser);
}

ProjectsPage.title = "Bandwidth Labs: Projects";

ProjectsPage.visit = function (browser) {
  return browser.visit("/projects");
};

ProjectsPage.prototype             = Object.create(Page.prototype);
ProjectsPage.prototype.constructor = ProjectsPage;

module.exports = ProjectsPage;

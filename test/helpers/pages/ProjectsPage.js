"use strict";
var Page = require("./Page");

function ProjectsPage (browser) {
  Page.call(this, browser);

  this.projects = function () {
    var elements = browser.queryAll("ul.project-list li.project");

    return elements.map(function (element) {
      return {
        avatar      : element.querySelector("img.avatar").getAttribute("src"),
        description : browser.text(element.querySelector("p.description")),
        name        : browser.text(element.querySelector("span.name")),
        url         : element.querySelector("a").getAttribute("href")
      };
    });
  };
}

ProjectsPage.activeNav = "Projects";
ProjectsPage.title     = "Bandwidth Labs: Projects";

ProjectsPage.visit = function (browser) {
  return browser.visit("/projects");
};

ProjectsPage.prototype             = Object.create(Page.prototype);
ProjectsPage.prototype.constructor = ProjectsPage;

module.exports = ProjectsPage;

"use strict";
var GitHub = module.exports;
var Nock   = require("nock");
var URL    = require("url");

var GITHUB_API = "https://api.github.com/";
var GITHUB_RAW = "https://raw.githubusercontent.com/";

function projectsPath (organization) {
  return "/orgs/" + organization + "/repos";
}

function readmePath (organization, repository) {
  return "/" + organization + "/" + repository + "/master/README.md";
}

GitHub.organization = "githuborg";
GitHub.token        = "auniquetoken";

GitHub.createReadme = function (organization, repository, status, badge) {
  var content = badge ?
    "[![Bandwidth Labs]" +
    "(https://img.shields.io/badge/bandwidth_labs-showcase-orange.svg)]" +
    "(http://vitrino.herokuapp.com)"
    :
    "";

  return Nock(GITHUB_RAW)
  .get(readmePath(organization, repository))
  .reply(status, content);
};

GitHub.resetProjects = function (organization) {
  var options = URL.parse(GITHUB_API);

  Nock.removeInterceptor({
    hostname : options.hostname,
    path     : projectsPath(organization),
    proto    : options.protocol.substr(0, options.protocol.length - 1)
  });
};

GitHub.resetReadme = function (organization, repository) {
  var options = URL.parse(GITHUB_RAW);

  Nock.removeInterceptor({
    hostname : options.hostname,
    path     : readmePath(organization, repository),
    proto    : options.protocol.substr(0, options.protocol.length - 1)
  });
};

GitHub.setProjects = function (organization, projects) {
  return Nock(GITHUB_API)
  .persist()
  .get(projectsPath(organization))
  .reply(200, projects);
};

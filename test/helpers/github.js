"use strict";
var GitHub = module.exports;
var Nock   = require("nock");
var URL    = require("url");

var GITHUB_API = "https://api.github.com/";

function projectsPath (organization) {
  return "/orgs/" + organization + "/repos";
}

GitHub.organization = "githuborg";
GitHub.token        = "auniquetoken";

GitHub.resetProjects = function (organization) {
  var options = URL.parse(GITHUB_API);

  Nock.removeInterceptor({
    hostname : options.hostname,
    path     : projectsPath(organization),
    proto    : options.protocol.substr(0, options.protocol.length - 1)
  });
};

GitHub.setProjects = function (organization, projects) {
  return Nock(GITHUB_API)
  .persist()
  .get(projectsPath(organization))
  .reply(200, projects);
};

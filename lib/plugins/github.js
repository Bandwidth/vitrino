"use strict";
var Joi   = require("joi");
var Q     = require("q");
var URL   = require("url");
var Wreck = require("wreck");
var _     = require("lodash");

var OPTIONS_SCHEMA = Joi.object().keys({
  organization : Joi.string().required(),
  token        : Joi.string().required()
});

var BADGE      = "[![Bandwidth Labs]" +
  "(https://img.shields.io/badge/bandwidth_labs-showcase-orange.svg)]" +
  "(http://showcase.bandwidthlabs.com)";
var GITHUB     = "https://api.github.com";
var GITHUB_RAW = "https://raw.githubusercontent.com";

exports.register = function (plugin, options, done) {
  var repositories;

  options.organization = process.env.ORGANIZATION;
  options.token        = process.env.TOKEN;

  repositories = URL.resolve(GITHUB, "/orgs/" + options.organization + "/repos");

  function handleErrors (response, payload) {
    if (200 !== response.statusCode) {
      plugin.log(
        [ "github", "error" ],
        "Failed to get projects with status " + response.statusCode +
        " and message '" + payload.message + "'."
      );
      throw new Error(payload.message);
    }
  }

  function parseProjectList (payload) {
    return Q.all(_.map(
      payload,
      function (project) {
        return projectType(project.name)
        .then(function (type) {
          var descriptor = _.pick(project, [ "description", "name", "private" ]);

          /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
          /* jshint -W106 */
          descriptor.avatar = project.owner.avatar_url;
          descriptor.type   = type;
          descriptor.url    = project.homepage || project.html_url;
          /* jshint +W106 */
          /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

          return descriptor;
        });
      }
    ));
  }

  function projectType (name) {
    var readme = URL.resolve(
      GITHUB_RAW,
      "/" + options.organization + "/" + name + "/master/README.md"
    );

    return Q.ninvoke(Wreck, "get", readme, requestOptions())
    .spread(function (response, payload) {
      if (200 === response.statusCode && payload.indexOf(BADGE) !== -1) {
        return "showcase";
      }
      else {
        return "other";
      }
    });
  }

  function requestOptions () {
    var request = { json : true };

    request.headers = {};
    request.headers.authorization = "Basic " +
      (new Buffer(options.token + ":x-oauth-basic")).toString("base64");
    request.headers["user-agent"] = "Wreck";

    return request;
  }

  plugin.expose("projects", function () {
    var options = requestOptions();

    return Q.ninvoke(Wreck, "get", repositories, options)
    .spread(function (response, payload) {
      handleErrors(response, payload);
      return parseProjectList(payload);
    });
  });

  Joi.validate(options, OPTIONS_SCHEMA, done);
};

exports.register.attributes = {
  name : "github"
};

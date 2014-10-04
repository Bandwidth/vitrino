"use strict";
var Environment  = require("apparition").Environment;
var GitHub       = require("../../lib/plugins/github");
var GitHubHelper = require("../helpers/github");
var Lab          = require("lab");
var Nock         = require("nock");
var Plugins      = require("../helpers/plugins");
var Sinon        = require("sinon");
var Wreck        = require("wreck");

var script = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The github plugin", function () {
  var GITHUB_API       = "https://api.github.com";
  var ORGANIZATION     = "organization";
  var ORGANIZATION_KEY = "ORGANIZATION";
  var TOKEN            = "atoken";
  var TOKEN_KEY        = "TOKEN";

  var environment;

  function describeRequiredConfig (key) {
    describe("without the '" + key + "' parameter", function () {
      var environment;

      before(function (done) {
        environment = new Environment();
        environment.delete(key.toUpperCase());
        done();
      });

      after(function (done) {
        environment.restore();
        done();
      });

      it("fails to register", function (done) {
        Plugins.server(GitHub)
        .then(
          function () {
            throw new Error("Should not succeed.");
          },
          function (error) {
            expect(error, "type").to.be.an.instanceOf(Error);
            expect(error.message, "message").to.match(new RegExp(key + " is required", "i"));
          }
        )
        .nodeify(done);
      });
    });
  }

  before(function (done) {
    environment = new Environment();
    environment.set(ORGANIZATION_KEY, ORGANIZATION);
    environment.set(TOKEN_KEY, TOKEN);

    done();
  });

  after(function (done) {
    environment.restore();
    done();
  });

  it("has a name", function (done) {
    expect(GitHub.register.attributes, "name").to.have.property("name", "github");
    done();
  });

  // All environment configuration parameters are required.
  [ ORGANIZATION_KEY, TOKEN_KEY ].forEach(describeRequiredConfig);

  describe("with an organization and a token", function () {
    var AGENT         = "Wreck";
    var AUTHORIZATION = "Basic " + (new Buffer(TOKEN + ":x-oauth-basic")).toString("base64");

    var server;

    before(function (done) {
      Plugins.server(GitHub)
      .then(function (result) {
        server = result;
      })
      .nodeify(done);
    });

    after(function (done) {
      environment.restore();
      done();
    });

    describe("getting a list of projects", function () {
      function request () {
        return new Nock(GITHUB_API)
        .matchHeader("Authorization", AUTHORIZATION)
        .matchHeader("User-Agent", AGENT)
        .get("/orgs/" + ORGANIZATION + "/repos");
      }

      describe("without an error", function () {
        var emptyReadme;
        var noReadme;
        var projects;
        var readme;
        var repositories;

        before(function (done) {
          emptyReadme = GitHubHelper.createReadme(ORGANIZATION, "Pork-Chops", 200, "");

          noReadme = GitHubHelper.createReadme(ORGANIZATION, "Sandwiches", 404);

          readme = GitHubHelper.createReadme(
            ORGANIZATION,
            "The-Best-Project-Ever",
            200,
            [
              "[![Bandwidth Labs]",
              "(https://img.shields.io/badge/bandwidth_labs-showcase-orange.svg)]",
              "(http://vitrino.herokuapp.com)"
            ].join("")
          );

          repositories = request().reply(
            200,
            [
              /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
              /* jshint -W106 */
              {
                name        : "The-Best-Project-Ever",
                description : "Pure awesomeness.",
                private     : false,
                html_url    : "https://github.com/octocat/Hello-World",

                owner : {
                  login      : "octocat",
                  avatar_url : "https://github.com/images/error/octocat_happy.gif"
                }
              },

              {
                name        : "Sandwiches",
                description : "Every creature deserves a warm meal.",
                private     : true,
                homepage    : "https://github.com/octocat/Sandwiches",

                owner : {
                  login      : "somebody",
                  avatar_url : "https://example.com/avatar.gif"
                }
              },

              {
                name        : "Pork-Chops",
                description : "More food.",
                private     : true,
                html_url    : "https://github.com/octocat/Pork-Chops",
                homepage    : "http://example.com",

                owner : {
                  login      : "pork",
                  avatar_url : "https://example.com/chops.gif"
                }
              }
              /* jshint +W106 */
              /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
            ],
            {
              "Content-Type" : "application/json"
            }
          );

          server.plugins.github.projects()
          .then(function (results) {
            projects = results;
          })
          .nodeify(done);
        });

        after(function (done) {
          GitHubHelper.resetReadme(ORGANIZATION, "Pork-Chops");
          GitHubHelper.resetReadme(ORGANIZATION, "Sandwiches");
          GitHubHelper.resetReadme(ORGANIZATION, "The-Best-Project-Ever");
          done();
        });

        it("queries the configured organization", function (done) {
          repositories.done();
          done();
        });

        it("returns a list of projects", function (done) {
          expect(projects, "projects").to.deep.equal([
            {
              avatar      : "https://github.com/images/error/octocat_happy.gif",
              description : "Pure awesomeness.",
              name        : "The-Best-Project-Ever",
              private     : false,
              type        : "showcase",
              url         : "https://github.com/octocat/Hello-World"
            },

            {
              avatar      : "https://example.com/avatar.gif",
              description : "Every creature deserves a warm meal.",
              name        : "Sandwiches",
              private     : true,
              type        : "other",
              url         : "https://github.com/octocat/Sandwiches"
            },

            {
              avatar      : "https://example.com/chops.gif",
              description : "More food.",
              name        : "Pork-Chops",
              private     : true,
              type        : "other",
              url         : "http://example.com"
            }
          ]);
          done();
        });
      });

      describe("with an invalid token", function () {
        var error;
        var nock;

        before(function (done) {
          nock = request().reply(
            401,
            {
              message : "Bad credentials"
            }
          );

          server.plugins.github.projects()
          .then(
            function () {
              throw new Error("Should not succeed.");
            },
            function (failure) {
              error = failure;
            }
          )
          .nodeify(done);
        });

        it("queries GitHub", function (done) {
          nock.done();
          done();
        });

        it("fails to get a list of projects", function (done) {
          expect(error, "error").to.be.an.instanceOf(Error);
          expect(error.message, "message").to.match(/bad credentials/i);
          done();
        });
      });

      describe("with a networking error", function () {
        var error = new Error("Simulated failure.");

        var failure;
        var get;

        before(function (done) {
          get = Sinon.stub(Wreck, "get");
          get.callsArgWith(2, error);

          server.plugins.github.projects()
          .then(
            function () {
              throw new Error("Should not succeed.");
            },
            function (error) {
              failure = error;
            }
          )
          .nodeify(done);
        });

        after(function (done) {
          get.restore();
          done();
        });

        it("fails to get a list of projects", function (done) {
          expect(failure, "error").to.equal(error);
          done();
        });
      });
    });
  });
});

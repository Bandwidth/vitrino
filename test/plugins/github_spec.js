"use strict";
var Environment = require("apparition").Environment;
var Github      = require("../../lib/plugins/github");
var Lab         = require("lab");
var Nock        = require("nock");
var Plugins     = require("../helpers/plugins");
var Sinon       = require("sinon");
var Wreck       = require("wreck");

var script      = exports.lab = Lab.script();

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
        Plugins.server(Github)
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
    expect(Github.register.attributes, "name").to.have.property("name", "github");
    done();
  });

  // All environment configuration parameters are required.
  [ ORGANIZATION_KEY, TOKEN_KEY ].forEach(describeRequiredConfig);

  describe("with an organization and a token", function () {
    var AGENT         = "Wreck";
    var AUTHORIZATION = "Basic " + (new Buffer(TOKEN + ":x-oauth-basic")).toString("base64");

    var server;

    before(function (done) {
      Plugins.server(Github)
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
        var nock;
        var projects;

        before(function (done) {
          nock = request().reply(
            200,
            [
              /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
              /* jshint -W106 */
              {
                name        : "The Best Project Ever",
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

        it("queries the configured organization", function (done) {
          nock.done();
          done();
        });

        it("returns a list of projects", function (done) {
          expect(projects, "projects").to.deep.equal([
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

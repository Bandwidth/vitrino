"use strict";
var GitHub = require("./github");
var Lab    = require("lab");
var Nock   = require("nock");
var Q      = require("q");
var Sinon  = require("sinon");
var Wreck  = require("wreck");

var script = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The GitHub test helper", function () {
  it("specifies an organization", function (done) {
    expect(GitHub, "organization").to.have.property("organization", "githuborg");
    done();
  });

  it("specifies a token", function (done) {
    expect(GitHub, "token").to.have.property("token", "auniquetoken");
    done();
  });

  describe("setting a project list", function () {
    var projects = [];

    var result;
    var scope;
    var status;

    before(function (done) {
      scope = GitHub.setProjects("foo", projects);

      Q.ninvoke(Wreck, "get", "https://api.github.com/orgs/foo/repos", { json : true })
      .spread(function (response, payload) {
        result = payload;
        status = response.statusCode;
      })
      .nodeify(done);
    });

    it("causes a project request to return the specified list", function (done) {
      expect(status, "status code").to.equal(200);
      expect(result, "projects").to.deep.equal(projects);
      done();
    });

    it("returns a nock scope", function (done) {
      expect(scope, "scope").to.have.property("pendingMocks").that.is.a("function");
      done();
    });

    describe("and using a token", function () {
      var result;
      var status;

      before(function (done) {
        var options = {
          headers : {
            authorization : "Basic foo"
          },

          json : true
        };

        Q.ninvoke(Wreck, "get", "https://api.github.com/orgs/foo/repos", options)
        .spread(function (response, payload) {
          result = payload;
          status = response.statusCode;
        })
        .nodeify(done);
      });

      it("also returns the project list", function (done) {
        expect(status, "status code").to.equal(200);
        expect(result, "projects").to.deep.equal(projects);
        done();
      });
    });
  });

  describe("resetting the project list", function () {
    var remove;

    before(function (done) {
      remove = Sinon.stub(Nock, "removeInterceptor");
      GitHub.resetProjects("foo");
      done();
    });

    after(function (done) {
      remove.restore();
      done();
    });

    it("unconfigures project list mocking", function (done) {
      expect(remove.callCount, "remove").to.equal(1);
      expect(remove.firstCall.args[0], "options").to.deep.equal({
        hostname : "api.github.com",
        path     : "/orgs/foo/repos",
        proto    : "https"
      });
      done();
    });
  });
});

"use strict";
var Hapi    = require("hapi");
var Lab     = require("lab");
var Plugins = require("./plugins");
var script  = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("The plugins helper", function () {
  describe("creating a test server", function () {
    var error = new Error("failure");

    var badPlugin = {
      name     : "bad",
      register : function (plugin, options, done) {
        done(error);
      }
    };

    var goodPlugin = {
      name     : "good",
      register : function (plugin, options, done) {
        plugin.expose("key", "value");
        done();
      }
    };

    describe("successfully registering all plugins", function () {
      var server;

      before(function (done) {
        Plugins.server(goodPlugin)
        .then(function (result) {
          server = result;
        })
        .nodeify(done);
      });

      it("creates a Hapi server", function (done) {
        expect(server, "server").to.be.an.instanceOf(Hapi.Server);
        done();
      });

      it("includes the requested plugins", function (done) {
        expect(server.plugins, "good").to.have.property("good");
        done();
      });
    });

    describe("failing to register a plugin", function () {
      var failure;

      before(function (done) {
        Plugins.server(badPlugin)
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

      it("fails to create a server", function (done) {
        expect(failure, "error").to.equal(error);
        done();
      });
    });
  });
});

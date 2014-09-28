"use strict";
var Lab         = require("lab");
var LandingPage = require("./LandingPage");
var Page        = require("./Page");
var script      = exports.lab = Lab.script();

var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("A LandingPage helper", function () {
  Page.isAPageHelper(script, LandingPage, "/");

  it("has a title", function (done) {
    expect(LandingPage, "title").to.have.property("title", "Bandwidth Labs: Showcase");
    done();
  });

  it("has a content header", function (done) {
    expect(LandingPage, "content header")
    .to.have.property("contentHeader", "Bandwidth Labs Showcase");
    done();
  });

  it("has an active nav element", function (done) {
    expect(LandingPage, "active nav").to.have.property("activeNav", "Home");
    done();
  });
});

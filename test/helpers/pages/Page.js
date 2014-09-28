"use strict";
var expect = require("lab").expect;

function Page (browser) {
  this.contentHeader = function () {
    return browser.text("h1");
  };

  this.jQuery = function () {
    var jQuery = browser.window.$;

    if (!jQuery) {
      throw new Error("jQuery is not present.");
    }

    return jQuery;
  };

  this.title = function () {
    return browser.text("title");
  };
}

Page.describeNavbar = function (context) {
  var script = context.script;

  var before   = script.before;
  var describe = script.describe;
  var it       = script.it;

  describe("navbar", function () {
    var navbar;

    before(function (done) {
      var error = null;
      var page  = context.page;

      var $;

      try {
        $ = page.jQuery();
        navbar = $(".navbar");
      }
      catch (failure) {
        error = failure;
      }

      done(error);
    });

    it("is present", function (done) {
      expect(navbar, "present").to.have.length(1);
      done();
    });

    it("has a brand", function (done) {
      var brand = navbar.find(".navbar-header a.navbar-brand");
      expect(brand, "brand").to.have.length(1);
      expect(brand.attr("href"), "href").to.equal("http://bandwidthlabs.com");
      done();
    });

    it("has a link to the landing page", function (done) {
      var home = navbar.find(".nav.navbar-nav a:contains('Home')");
      expect(home, "home").to.have.length(1);
      expect(home.attr("href"), "href").to.equal("/");
      done();
    });
  });
};

module.exports = Page;

"use strict";
var Browser = require("zombie");
var expect  = require("lab").expect;
var URL     = require("url");

function Page (browser) {
  this.activeNav = function () {
    var activeNav = browser.queryAll("ul.nav li.active");

    if (activeNav.length === 0) {
      throw new Error("No active nav element was found.");
    }
    else if (activeNav.length > 1) {
      throw new Error("Found multiple active nav elements.");
    }

    return browser.text(activeNav[0]);
  };

  this.content = function () {
    return browser.text(".panel-body");
  };


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

Page.describeNavbar = function (context, activeNav) {
  var script = context.script;

  var before   = script.before;
  var describe = script.describe;
  var it       = script.it;

  describe("navbar", function () {
    var navbar;
    var page;

    before(function (done) {
      var error = null;
      var $;

      page  = context.page;

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

    it("has a link to the projects page", function (done) {
      var projects = navbar.find(".nav.navbar-nav a:contains('Projects')");
      expect(projects, "projects").to.have.length(1);
      expect(projects.attr("href"), "href").to.equal("/projects");
      done();
    });

    it("has an active nav element", function (done) {
      expect(page.activeNav(), "active nav").to.equal(activeNav);
      done();
    });
  });
};

Page.isAPageHelper = function (script, Constructor, path) {
  var before   = script.before;
  var describe = script.describe;
  var it       = script.it;

  it("is a page helper", function (done) {
    expect(Constructor, "type").to.be.a("function");
    expect(Constructor.prototype, "supertype").to.be.an.instanceOf(Page);
    expect(Constructor.prototype.constructor, "constructor").to.equal(Constructor);
    expect(Constructor.visit, "visit").to.be.a("function");
    done();
  });

  describe("visiting the page", function () {
    var browser;

    before(function (done) {
      try {
        browser = new Browser();
        Constructor.visit(browser).nodeify(done);
      }
      catch (error) {
        done(error);
      }
    });

    it("navigates to the page URL", function (done) {
      expect(browser.url, "URL").to.equal(URL.resolve(browser.site, path));
      done();
    });
  });
};

module.exports = Page;

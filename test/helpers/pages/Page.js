"use strict";

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

module.exports = Page;

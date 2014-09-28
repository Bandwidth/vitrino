"use strict";

function Page (browser) {
  this.contentHeader = function () {
    return browser.text("h1");
  };

  this.title = function () {
    return browser.text("title");
  };
}

module.exports = Page;

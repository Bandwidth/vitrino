"use strict";

function Page (browser) {
  this.title = function () {
    return browser.text("title");
  };
}

module.exports = Page;

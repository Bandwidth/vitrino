"use strict";
var Page = require("./Page");

function LandingPage (browser) {
	Page.call(this, browser);
}

LandingPage.title = "vitrino";

LandingPage.visit = function (browser) {
	return browser.visit("/");
};

LandingPage.prototype = Object.create(Page.prototype);

module.exports = LandingPage;

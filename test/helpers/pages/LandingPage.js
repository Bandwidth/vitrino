"use strict";
var Page = require("./Page");

function LandingPage (browser) {
	Page.call(this, browser);
}

LandingPage.activeNav     = "Home";
LandingPage.contentHeader = "Bandwidth Labs Showcase";
LandingPage.title         = "Bandwidth Labs: Showcase";

LandingPage.visit = function (browser) {
	return browser.visit("/");
};

LandingPage.prototype             = Object.create(Page.prototype);
LandingPage.prototype.constructor = LandingPage;

module.exports = LandingPage;

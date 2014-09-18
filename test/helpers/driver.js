"use strict";
var Driver = module.exports = Object.create(null);
var FS     = require("fs");
var Page   = require("./pages/Page");
var Path   = require("path");
var Q      = require("q");
var URL    = require("url");
var UUID   = require("node-uuid");

var FIXTURE_PATH = Path.join(__dirname, "..", "fixtures");

Driver.extend = function (browser) {
	browser.goto = function (Destination) {
		if ("function" !== typeof Destination.visit) {
			return Q.reject(new Error("A page helper must have a visit method."));
		}
		if ("function" !== typeof Destination || !(Destination.prototype instanceof Page)) {
			return Q.reject(new Error("The page must be a page helper."));
		}

		return Destination.visit(browser)
		.then(function () {
			return new Destination(browser);
		});
	};

	browser.loadFixture = function (fixture) {
		var path = "/text-fixtures/" + UUID.v4();

		fixture  = Path.join(FIXTURE_PATH, fixture);

		return Q.ninvoke(FS, "readFile", fixture, { encoding : "utf8" })
		.then(function (contents) {
			browser.resources.mock(
				path,
				{
					body       : contents,
					statusCode : 200
				}
			);

			return browser.visit(URL.resolve(browser.site, path));
		})
		.then(function () {
			browser.resources.restore(path);
		});
	};
};

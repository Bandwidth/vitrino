"use strict";
var Driver = module.exports = Object.create(null);
var FS     = require("fs");
var Path   = require("path");
var Q      = require("q");
var URL    = require("url");
var UUID   = require("node-uuid");

var FIXTURE_PATH = Path.join(__dirname, "..", "fixtures");

Driver.extend = function (browser) {
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

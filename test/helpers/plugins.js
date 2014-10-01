"use strict";
var Hapi    = require("hapi");
var Plugins = module.exports = Object.create(null);
var Q       = require("q");

Plugins.server = function (plugin) {
  var server = new Hapi.Server();

  return Q.ninvoke(server.pack, "register", plugin)
  .then(function () {
    return server;
  });
};

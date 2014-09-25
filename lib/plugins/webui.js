"use strict";
var _ = require("lodash");

exports.register = function (plugin, options, done) {
  plugin.events.on("start", function () {
    _.each(plugin.servers, function (server) {
      plugin.log([ "info" ], "Server started at '" + server.info.uri + "'.");
    });
  });

  plugin.route({
    method : "GET",
    path   : "/",

    handler : function (request, reply) {
      reply("<html><head><title>vitrino</title></head></html>");
    }
  });

  done();
};

exports.register.attributes = {
  name : "webui"
};

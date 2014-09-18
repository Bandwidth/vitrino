"use strict";

exports.register = function (plugin, options, done) {
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

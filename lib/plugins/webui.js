"use strict";

exports.register = function (plugin, options, done) {
  plugin.route({
    method : "GET",
    path   : "/",

    handler : function (request, reply) {
      reply("hello there!");
    }
  });

  done();
};

exports.register.attributes = {
  name : "webui"
};

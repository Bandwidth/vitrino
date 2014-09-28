"use strict";
var Mustache = require("mustache");
var Path     = require("path");
var _        = require("lodash");

function MustacheEngine () {
  var partials = Object.create(null);

  this.compile = function (template) {
    Mustache.parse(template);

    return function (view) {
      return Mustache.render(template, view, partials);
    };
  };

  this.registerPartial = function (name, source) {
    partials[name] = source;
  };
}

exports.register = function (plugin, options, done) {
  plugin.events.on("start", function () {
    _.each(plugin.servers, function (server) {
      plugin.log([ "info" ], "Server started at '" + server.info.uri + "'.");
    });
  });

  plugin.views({
    basePath         : Path.join(__dirname, "..", "templates"),
    defaultExtension : "html",
    partialsPath     : "partials/",

    engines : {
      html : new MustacheEngine()
    }
  });

  plugin.route({
    method : "GET",
    path   : "/",

    handler : function (request, reply) {
      reply.view("landing", { title : "Bandwidth Labs: Showcase" });
    }
  });

  plugin.route({
    method : "GET",
    path   : "/static/{file*}",

    handler : {
      directory : {
        path : Path.join(__dirname, "..", "static")
      }
    }
  });

  done();
};

exports.register.attributes = {
  name : "webui"
};

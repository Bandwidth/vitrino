"use strict";
var FS   = require("fs");
var Gulp = require("gulp");
var Path = require("path");
var Q    = require("q");
var _    = require("lodash");

var paths = {
  client : Path.join(__dirname, "lib", "client", "*.js"),

  jscs : Path.join(__dirname, ".jscsrc"),

  jshint : {
    client : Path.join(__dirname, "lib", "client", ".jshintrc"),
    source : Path.join(__dirname, ".jshintrc"),
    test   : Path.join(__dirname, "test", ".jshintrc")
  },

  source : [
    Path.join(__dirname, "*.js"),
    Path.join(__dirname, "lib", "**", "*.js"),
    "!" + Path.join(__dirname, "lib", "client", "**", "*.js"),
    "!" + Path.join(__dirname, "lib", "static", "**", "*.js")
  ],

  static : [
    Path.join(__dirname, "lib", "client", "*.js"),
    Path.join(__dirname, "lib", "client", "*.css")
  ],

  test : [
    Path.join(__dirname, "test", "helpers", "setup.js"),
    Path.join(__dirname, "test", "**", "*_spec.js")
  ]
};

function lint (options, files) {
  var Jshint  = require("gulp-jshint");
  var Stylish = require("jshint-stylish");

  return Gulp.src(files)
  .pipe(new Jshint(options))
  .pipe(Jshint.reporter(Stylish))
  .pipe(Jshint.reporter("fail"));
}

function loadOptions (path) {
  return Q.ninvoke(FS, "readFile", path, { encoding : "utf8" })
  .then(function (contents) {
    return JSON.parse(contents);
  });
}

function promisefy (stream) {
  var deferred = Q.defer();

  stream.once("finish", deferred.resolve.bind(deferred));
  stream.once("error", deferred.reject.bind(deferred));

  return deferred.promise;
}

function style (options, files) {
  var Jscs = require("gulp-jscs");
  return Gulp.src(files).pipe(new Jscs(options));
}

Gulp.task("assets", [ "bower" ], function () {
  return Gulp.src(paths.static).pipe(Gulp.dest("lib/static"));
});

Gulp.task("bower", function () {
  var Bower = require("gulp-bower");
  return (new Bower()).pipe(Gulp.dest("lib/static"));
});

Gulp.task("coverage", function () {
  var Lab = require("gulp-lab");

  var options = {
    args : "-p -r html -o" + Path.join(__dirname, "coverage.html"),
    opts : { emitLabError : false }
  };

  return Gulp.src(paths.test).pipe(new Lab(options));
});

Gulp.task("default", [ "test" ]);

Gulp.task("lint", [ "lint-client", "lint-source", "lint-test" ]);

Gulp.task("lint-client", function () {
  return Q.all([
    loadOptions(paths.jshint.client),
    loadOptions(paths.jshint.source)
  ])
  .spread(function (client, source) {
    var options = _.merge(source, client);
    return promisefy(lint(options, paths.client));
  });
});

Gulp.task("lint-source", function () {
  return loadOptions(paths.jshint.source)
  .then(function (options) {
    return promisefy(lint(options, paths.source));
  });
});

Gulp.task("lint-test", function () {
  return Q.all([
    loadOptions(paths.jshint.source),
    loadOptions(paths.jshint.test)
  ])
  .spread(function (source, test) {
    var options = _.merge(source, test);
    return promisefy(lint(options, paths.test));
  });
});

Gulp.task("style", function () {
  return loadOptions(paths.jscs)
  .then(function (options) {
    return promisefy(style(options, paths.source.concat(paths.test)));
  });
});

Gulp.task("test", [ "assets", "lint", "style" ], function () {
  var Lab = require("gulp-lab");

  var options = {
    args : "-v -p -t 100",
    opts : { emitLabError : true }
  };

  return Gulp.src(paths.test).pipe(new Lab(options));
});

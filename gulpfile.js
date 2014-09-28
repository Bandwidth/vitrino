"use strict";
var Bower   = require("gulp-bower");
var FS      = require("fs");
var Gulp    = require("gulp");
var Jscs    = require("gulp-jscs");
var Jshint  = require("gulp-jshint");
var Lab     = require("gulp-lab");
var Path    = require("path");
var Q       = require("q");
var Stylish = require("jshint-stylish");
var _       = require("lodash");

var paths = {
  jscs : Path.join(__dirname, ".jscsrc"),

  jshint : {
    source : Path.join(__dirname, ".jshintrc"),
    test   : Path.join(__dirname, "test", ".jshintrc")
  },

  source : [
    Path.join(__dirname, "*.js"),
    Path.join(__dirname, "lib", "**", "*.js"),
    "!" + Path.join(__dirname, "lib", "static", "**", "*.js")
  ],

  test : [
    Path.join(__dirname, "test", "helpers", "setup.js"),
    Path.join(__dirname, "test", "**", "*_spec.js")
  ]
};

function lint (options, files) {
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
  return Gulp.src(files).pipe(new Jscs(options));
}

Gulp.task("assets", [ "bower" ]);

Gulp.task("bower", function () {
  return (new Bower()).pipe(Gulp.dest("lib/static"));
});

Gulp.task("coverage", function () {
  var options = {
    args : "-p -r html -o" + Path.join(__dirname, "coverage.html"),
    opts : { emitLabError : false }
  };

  return Gulp.src(paths.test).pipe(new Lab(options));
});

Gulp.task("default", [ "test" ]);

Gulp.task("lint", [ "lint-source", "lint-test" ]);

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
  var options = {
    args : "-v -p -t 100",
    opts : { emitLabError : true }
  };

  return Gulp.src(paths.test).pipe(new Lab(options));
});

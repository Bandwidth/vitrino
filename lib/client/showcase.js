"use strict";
$(function () {
  var navs = $("ul.nav a");
  var path = window.location.pathname;

  navs.each(function () {
    var nav = $(this);

    if (nav.attr("href") === path) {
      nav.parent().addClass("active");
    }
  });
});

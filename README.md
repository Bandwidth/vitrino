# ⚠️ DEPRECATED⚠️ 

vitrino
=======

[![Build Status](https://travis-ci.org/bandwidthcom/vitrino.svg?branch=master)](https://travis-ci.org/bandwidthcom/vitrino)
[![Bandwidth Labs](https://img.shields.io/badge/bandwidth_labs-showcase-orange.svg)](http://showcase.bandwidthlabs.com)

> Bandwidth Labs project showcase.

## Overview

The [Bandwidth Labs Showcase][showcase] is a website highlighting the public
projects being worked on at Bandwidth Labs. The site collects and links to
project information from a variety of sources in order to streamline the
maintenance process and ensure that the information is always up-to-date.

## Creating a Project

Currently, showcase projects must live in [GitHub][github]. For a project to
appear in the [Bandwidth Labs Showcase][showcase] it must belong to the
[Bandwidth Labs GitHub organization][bandwidthcom] and must include the
showcase application badge in the `README.md`.

In the current version of the application, the badge must appear verbatim in
the README. The following is the only acceptable badge format:

    [![Bandwidth Labs](https://img.shields.io/badge/bandwidth_labs-showcase-orange.svg)](http://showcase.bandwidthlabs.com)

If both criteria are met, the project will automatically show up on the
[projects page][showcase-projects].

## Project Configuration

The details that appear on the [projects page][showcase-projects] are determined
by the project's [GitHub][github] configuration. The following fields can be
configured:

 + **description** -- this is the description of the project in [GitHub][github]
  (this has no relation to `README.md`).
 + **icon** -- this is the avatar of the owner of the project as configured in
  [GitHub][github].
 + **link** -- if the project has configured a homepage, this URL will be used.
  Otherwise, the URL of the [GitHub][github] repository is used.
 + **name** -- this is the name of the project in [GitHub][github].

## Deployment and Configuration

While the showcase application has been created with a single purpose in mind,
it is theoretically possible to use it in other contexts. The showcase
application makes use of the following environment variables to determine
it's behavior:

| Variable     | Description                                                 |
|--------------|-------------------------------------------------------------|
| ORGANIZATION | The GitHub organization to pull projects from.              |
| PORT         | The port number the server should listen on.                |
| TOKEN        | The GitHub OAuth token to use to authenticate API requests. |

Other than environment variable configuration, the showcase application behaves
like any standard node application. Assuming the environment variables are
configured correctly, the application can be started by running the following
from within the root project directory:

    npm install && npm start

[bandwidthcom]: https://github.com/bandwidthcom "Bandwidth Labs Organization"
[github]: https://github.com "GitHub"
[showcase]: http://showcase.bandwidthlabs.com "Bandwidth Labs Showcase"
[showcase-projects]: http://showcase.bandwidthlabs.com/projects "Showcase Projects"

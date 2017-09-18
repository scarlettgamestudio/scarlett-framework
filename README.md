# Scarlett Framework
Scarlett WebGL Graphics Framework repository

![alt tag](http://scarlett.anlagehub.com/public/images/framework-banner.png)

[![Build Status][build-badge]][build]
[![Build status][win-build-badge]][win-build]
[![codecov][codecov-badge]][codecov]
[![Dependencies][dependencyci-badge]][dependencyci]
[![Commitizen friendly][commitizen-badge]][commitizen]
[![Semantic-release][semantic-release-badge]][semantic-release]
[![styled with prettier][prettier-badge]][prettier]

[![node-version][node-version-badge]][node]
<!--[![Apache-2.0][license-badge]][LICENSE]-->
<!--[![npm-version][npm-version-badge]][package]-->


# README #

### What is this repository for? ###

This repository contains the Scarlett Framework Module and associated libraries. **At the moment this software is in Development Stage and not ready for production use.**

### Setup ###

1. Install NodeJS (6.x or higher is recommended)
2. Fork and clone the repo
3. `$ npm install` to install dependencies
4. `$ npm run validate` to validate you've got it working

### Optional Setup - Scarlett-Editor ###

If also working on scarlett-editor (or any other project that depends on this framework), you might want to test it against a new and unreleased version of the framework. You can avoid manually copying the framework into the editor folder by referencing it instead. One good way is to use [symlinks](https://docs.npmjs.com/cli/link):
1. `$ cd ~/projects/scarlett-framework` go into the package directory
2. `$ npm link` create a global link of the framework package
3. `$ cd ~/projects/scarlett-editor` go into the consumer directory
4. `$ npm link @scarlett-game-studio/scarlett-framework` link install the framework

`scarlett-editor/node_modules` should now have the framework within. Rebuilding the framework with:

`$ npm run build:editor` or `$ npm run build:all` and refreshing/restarting the editor should be enough to update the framework version within the editor.

### Build & Distribution ###

There are 3 different builds:
1. `$ npm run build` - Browser (ES6) - should support the latest 2 versions. Handy when developing and testing on the browser.
2. `$ npm run build:editor` - CommonJS - version used when requiring the package (e.g., within scarlett-editor). Handy within node projects.
3. `$ npm run build:deploy` - Browser Minified (ES6) - should support the latest 2 versions. Handy when a browser project is ready to deploy.

You can also run all of the above with `$ npm run build:all`

### Recommended Code Editors ###

* Webstorm
* Visual Studio Code
* Atom

### IntelliJ/Webstorm Users ###

This project uses the latest Ecma6 Javascript features and therefore if you are using an IDE such as IntelliJ or Webstorm it might detect code errors when using the default settings.

To allow Ecma6 syntax make sure to change the Javascript Version in the settings menu (Settings -> Languages & Frameworks -> Javascript).

### Development Hints ###

* All main source code can be found in the /src folder
* Altough this project can be associated to the Scarlett-Editor, it can be used for standalone development (see /demos folder)

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

[package]: https://www.npmjs.com/org/scarlett-game-studio...........
[build-badge]: https://travis-ci.org/scarlettgamestudio/scarlett-framework.svg?branch=master
[build]: https://travis-ci.org/scarlettgamestudio/scarlett-framework
[win-build-badge]: https://ci.appveyor.com/api/projects/status/fusdtafmhfbmv7kd/branch/master?svg=true
[win-build]: https://ci.appveyor.com/project/Apidcloud/scarlett-framework/branch/master
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen]: http://commitizen.github.io/cz-cli/
[codecov-badge]: https://codecov.io/gh/scarlettgamestudio/scarlett-framework/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/scarlettgamestudio/scarlett-framework
[npm-version-badge]: https://img.shields.io/npm/v/scarlett-framework.svg
[node]: https://nodejs.org
[node-version-badge]: https://img.shields.io/badge/node-%3E%3D%206.0-orange.svg
[license-badge]: https://img.shields.io/npm/l/scarlett-framework.svg
[LICENSE]: https://github.com/scarlettgamestudio/scarlett-framework/blob/master/LICENSE.md
[dependencyci-badge]: https://dependencyci.com/github/scarlettgamestudio/scarlett-framework/badge
[dependencyci]: https://dependencyci.com/github/scarlettgamestudio/scarlett-framework
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[prettier-badge]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier

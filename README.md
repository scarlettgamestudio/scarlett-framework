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

[![typescript][typescript-version-badge]][typescript]
[![node-version][node-version-badge]][node]
<!--[![Apache-2.0][license-badge]][LICENSE]-->
<!--[![npm-version][npm-version-badge]][package]-->


# README #

This README would normally document whatever steps are necessary to get your application up and running. 

### What is this repository for? ###

This repository contains the Scarlett Framework Module and associated libraries. **At the moment this software is in Development Stage and not ready for production use.**

### How do I get set up? ###

* Install NodeJS (6.x or higher is recommended)
* Install GruntJS by running "npm install -g grunt-cli" in your computer terminal
* Open a terminal in the root folder and execute "npm install" for dependency resolution

### Optional Setup ###

* To activate automatic project build on code change simply run "grunt dev" on the root folder. 
* To change the directory output of the build file, change the 'copyToDirectory' target in Gruntfile.js.

### Build & Distribution ###

* To create a distribution ES6 file run "grunt dev-concat" (concatenates all source files into one). The ES6 files are located under the './build/' folder.
* To generate a ES5 file run "grunt dist" to execute babelJS and convert the framework from ES6. The ES5 files are located under the  './build-es5/' folder.

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
[typescript-version-badge]: https://img.shields.io/badge/typescript-2.3.4-blue.svg
[typescript]: https://www.typescriptlang.org/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[prettier-badge]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier

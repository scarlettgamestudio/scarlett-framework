# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
Gruntfile.js: change 'copyToDirectory' path to match the local scarlett editor path

```

var copyToDirectory = "C:\\Workspace\\scarlett-editor\\app\\lib\\";

```

* Dependencies
```

npm install

```

* Building - will also copy the build file to the specified editor path
```

grunt dev

```

### How do I run the demos? ###

* Install python 3.X and create a http server

```
py -3 -m http.server 8080

```

* Browserify - in case a demo is using node.js
```
browserify core.js - o bundle.js

```

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
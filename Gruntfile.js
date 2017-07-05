module.exports = function(grunt) {
  var copyToDirectory =
    "CHANGE PATH HERE USING DOUBLE SLASH AT THE END AS WELL\\";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    copy: {
      main: {
        src: "build/build-es6/<%= pkg.shortName %>.js",
        dest: copyToDirectory + "<%= pkg.shortName %>.js",
        filter: function(dest) {
          var validPath = grunt.file.isDir(copyToDirectory);
          if (validPath) {
            console.log("Copying file to " + copyToDirectory);
          } else {
            console.log(
              "INVALID GRUNT COPY PATH\nPlease fix copyToDirectory variable at Gruntfile.js"
            );
          }

          return validPath;
        }
      }
    },
    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["copy-to"],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Load the plugins here
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");

  // Default task(s).
  grunt.registerTask("dev", ["watch"]);
  grunt.registerTask("copy-to", ["copy"]);
};

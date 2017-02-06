module.exports = function(grunt) {

    var sortDependencies = require("sort-dependencies");
    var copyToDirectory = "D:\\Workspace\\scarlett-editor\\app\\lib\\";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                //src: ['src/**/*.js'],
                src: [
                    'node_modules/matter-js/build/matter.js',
                    sortDependencies.sortFiles("src/**/*.js")],
                dest:
                    'build/<%= pkg.name %>.js'
            }
        },
        copy: {
            main: {
                src: 'build/<%= pkg.name %>.js',
                dest:  copyToDirectory + '<%= pkg.name %>.js'
            }
        },
        jshint: {
            beforeconcat: ['src/**/*.js']
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['dev-concat', 'copy-to'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    // Load the plugins here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('watcher', ['watch']);
    grunt.registerTask('dist', ['uglify']);
    grunt.registerTask('dev', ['concat', 'copy-to', 'watch']);
    grunt.registerTask('dev-concat', ['concat']);
    grunt.registerTask('copy-to', ['copy']);

};
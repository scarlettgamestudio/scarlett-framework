module.exports = function(grunt) {

    var sortDependencies = require("sort-dependencies");
    var copyToDirectory = "D:\\MyPC\\Documents\\GitHub\\Scarlett\\scarlett-editor\\app\\lib\\";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            files: {
                expand: true,
                cwd: 'build',
                src: ['<%= pkg.name %>.js'],
                dest: 'build-es5/'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build-es5/<%= pkg.name %>.js',
                dest: 'build-es5/<%= pkg.name %>.min.js'
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
                    'src/common/**/*.js',
                    'src/utility/**/*.js',
                    'src/extensions/**/*.js',
                    'src/math/**/*.js',
                    'src/components/**/*.js',
                    'src/content/**/*.js',
                    'src/core/**/*.js',
                    'src/input/**/*.js',
                    'src/webgl/**/*.js',
                    sortDependencies.sortFiles("src/shaders/**/*.js")],
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
    grunt.loadNpmTasks('grunt-babel');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('watcher', ['watch']);
    grunt.registerTask('dist', ['babel', 'uglify']);
    grunt.registerTask('dev', ['concat', 'copy-to', 'watch']);
    grunt.registerTask('dev-concat', ['concat']);
    grunt.registerTask('copy-to', ['copy']);

};
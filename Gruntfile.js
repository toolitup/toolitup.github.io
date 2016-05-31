module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true,
                sourceMap: false,
                preserveComments: 'some',
            },
            dynamic_mappings: {
                files: [{
                    expand: true,
                    cwd: 'internal/js',
                    src: ['**/*.js'],
                    dest: 'assets/js/',
                    ext: '.min.js'
                }, ],
            },
        },

        autoprefixer: {

            options: {
                diff: true,
                map: false,
                browsers: ['> 1%', 'last 5 versions', 'Firefox ESR', 'Opera 12.1']
            },
            toolitup_css: {
                src: 'assets/css/*.css'
            },

        },

        jshint: {
            all: ['Gruntfile.js', 'internal/js/*.js'],
            options: {
                multistr: true
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'autoprefixer']);

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify', 'autoprefixer']);
};
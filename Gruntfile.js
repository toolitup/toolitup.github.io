module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: true,
        sourceMap : false,
        banner: '/*! <%= pkg.name %> - V<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dynamic_mappings: {
        files: [{
          expand: true,
          cwd: 'private/js',
          src: ['**/*.js'],
          dest: 'public/assets/js/',
          ext: '.min.js'
        },],
      },
    },

   autoprefixer: {

      options: {
        diff: true,
        map: true
      },
      toolitup_css: {
        src: 'public/assets/css/*.css'
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'autoprefixer']);

};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    build: {
      all: {
        dest: "dist/viewmachine.js",
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'build/**/*.js', 'tests/**/*.js'],
      options: {
        // options here to override JSHint defaults
        jshintrc: true,
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    qunit: {
      all: ['tests/*.html']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'build', 'uglify', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks( "build/" );

  grunt.registerTask('default', ['jshint', 'build', 'uglify', 'qunit']);

};
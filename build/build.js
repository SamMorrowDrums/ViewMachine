module.exports = function(grunt) {

  'use strict';

  var fs = require('fs'),
    requirejs = require('requirejs'),
    srcFolder = __dirname + '/../src/',
    rdefineEnd = /\}\);[^}\w]*$/,
    config = {
      baseUrl: 'src',
      name: 'viewMachine',
      out: 'dist/viewmachine.js',
      optimize: 'none',
      // Include dependencies loaded with require
      findNestedDependencies: true,
      // Avoid breaking semicolons inserted by r.js
      skipSemiColonInsertion: true,
      wrap: {
        //startFile: 'src/viewMachine.js',
        //endFile: 'src/outro.js'
      },
      rawText: {},
      onBuildWrite: convert
    };

  function convert(name, path, contents) {
    // Remove define wrappers, closure ends, and empty declarations
    contents = contents
      .replace(/\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, '$1')
      // Multiple exports
      .replace(/\s*exports\.\w+\s*=\s*\w+;/g, '');
    contents = contents
      .replace(/define\([^{]*?{/, '')
      .replace(rdefineEnd, '');
    // Remove empty definitions
    contents = contents
      .replace(/define\(\[[^\]]+\]\)[\W\n]+$/, '');
    return contents;
  }

  grunt.registerTask(
    'build',
    'Concatenate source, remove sub AMD definitions',
  function() {
    var flag, index,
      done = this.async(),
      name = config.out;

    config.out = function(compiled) {
      grunt.file.write(name, compiled);
    };
    // Trace dependencies and concatenate files
    requirejs.optimize(config, function(response) {
      grunt.verbose.writeln(response);
      grunt.log.ok('File ' + name + ' created.');
      done();
    }, function(err) {
      done(err);
    });
  });
};
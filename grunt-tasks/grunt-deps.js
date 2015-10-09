/* eslint-disable */
var Graph = require('graphs');
var esprima = require('esprima');
var path = require('path');

module.exports = function gruntDeps(grunt) {
  grunt.config('deps', {
    files: '../src/**/*.js',
    cwd: './build',
    modules: [/*{
      name: 'dojo',
      location: '../../../argos-sdk/libraries/dojo/dojo'
    }, {
      name: 'dijit',
      location: '../../../argos-sdk/libraries/dojo/dijit'
    }, */{
      name: 'crm',
      location: '../src'
    }/*, {
      name: 'argos',
      location: '../../../argos-sdk/src'
    }*/]
  });

  grunt.registerTask('deps', function() {
    var config = grunt.config.get('deps');
    grunt.file.setBase(config.cwd);
    var files = grunt.file.expand(config.files);
    var graph = new Graph();
    var nodes = {};

    function resolvePath(module, sourceFile) {
      var config = grunt.config.get('deps');
      var relative = module[0] === '.';
      if (relative) {
        var sourceDir = path.dirname(sourceFile);
        return path.join(sourceDir, module) + '.js';
      } else {
        var parts = module.split('/');
        var moduleName = parts.shift();
        var config = config.modules.filter(function(m) {
          return m.name === moduleName;
        })[0];
        var location = config && config.location;
        if (location) {
          var relativeModule = parts.join(path.sep);
          return path.join(location, relativeModule) + '.js';
        }
      }
    }

    function add(f) {
      if (nodes[f] || f === null || typeof f === 'undefined') {
        return nodes[f];
      }

      nodes[f] = {
        name: f
      };

      if (graph.has(nodes[f])) {
        return nodes[f];
      }

      graph.add(nodes[f]);
      return nodes[f];
    }

    function sortGraph(graph) {
      // Khan topological sort (https://en.wikipedia.org/wiki/Topological_sorting#Algorithms)
      var set = [];
      var sorted = [];
      // start nodes which have no incoming edges
      graph.forEach((node) => {
        if (graph.to(node)
          .size === 0) {
          set.push(node);
        }
      });

      while (set.length > 0) {
        var n = set.shift();
        sorted.push(n);

        var incoming = graph.from(n);
        for (var m of incoming) {
          graph.unlink(n, m);
          if (graph.to(m)
            .size === 0) {
            set.push(m);
          }
        };
      }

      // Ensure the graph has no more links
      graph.forEach((node) => {
        if (graph.from(node)
          .size > 0 || graph.to(node)
          .size > 0) {
          throw new Error('Circular dependencies detected.');
        }
      });

      return sorted;
    }

    files.forEach(function(file) {
      var sourceDir = path.dirname(file);
      var base = path.basename(file);
      var filepath = path.join(sourceDir, base); // grunt is not using correct seperator on windows
      var fileNode = add(filepath);
      var contents = grunt.file.read(filepath, {
        encoding: 'utf8'
      });
      try {
        var tree = esprima.parse(contents, {
          tolerant: true
        });
        var body = tree.body;
        body.filter(function(node) {
            return node.type === 'ImportDeclaration';
          })
          .forEach(function(node) {
            var p = resolvePath(node.source.value, filepath);
            var depNode = add(p);
            if (depNode) {
              graph.link(depNode, fileNode);
            }
          });
      } catch (error) {
        grunt.log.writeln(error);
      }
    });

    var sorted = sortGraph(graph);
    grunt.log.writeln('-----sorted results-----');
    sorted.forEach(function(i) {
      grunt.log.writeln(i.name);
    });
  });
};

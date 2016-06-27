
module.exports = function(grunt) {
  var path = require('path');
  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    dom_munger: {
      main: {
        options: {
            read: [
              {selector:'link.dev',attribute:'href',writeto:'cssRefs',isPath:true},
              {selector:'script.dev',attribute:'src',writeto:'jsRefs',isPath:true}
            ],
            remove: ['.dev'],
            append: [
              {selector:'head',html:'<base href="//mapoflife.github.io/' + pkg.base + '/" />'},
              {selector:'head',html:'<link href="static/app.min.css" rel="stylesheet">'},
              {selector:'head',html:'<script src="static/app.min.js"></script>'},
            ]
        },
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
    },
    cssmin: {
      main: {
        src:'<%= dom_munger.data.cssRefs %>', //use our read css references and concat+min them
        dest:'dist/static/app.min.css'
      }
    },
    uglify: {
      options: {mangle: false},
      main: {
        src: '<%= dom_munger.data.jsRefs %>', //use our read js references and concat+min them
        dest:'dist/static/app.min.js'
      }
    },
    copy : {
      main: {
        files: [
          { expand:true, nonull: false, cwd: 'src', src: ['static/app/**/*.{html,png,jpg}'], dest: 'dist/'}
        ],
      },
    },
    watch: {
      scripts: {
        files: ['src/*'],
        tasks: ['dom_munger','uglify','cssmin','copy'],
        options: {
          spawn: false,
        },
      }
    },
    buildcontrol: {
     options: {
       dir: 'dist',
       commit: true,
       branch: 'gh-pages',

       push: true,
       message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
     },
     pages: {
       options: {
         remote: pkg.repository,
         force:true,
         branch: 'gh-pages'
       }
     }
   },
   express: {
    dev: {
      options: {
        port: 9001,
        bases: 'src',
        server: path.resolve('./server/server')
      }
    }
  },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-build-control');
  grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-open');

  // Default task(s).
  grunt.registerTask('build', ['dom_munger','uglify','cssmin','copy']);
  grunt.registerTask('serve', ['express:dev', 'express-keepalive'])
  grunt.registerTask('deploy', ['buildcontrol:pages']);

};

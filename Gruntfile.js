module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    svgstore: {
      options: {
        prefix: 'shape-',
        includedemo: true
      },
      default: {
        files: {
          'assets/svg/sprite.svg': ['assets/svg/svgs/*.svg'],
        }
      }
    },

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
          // outputStyle: 'expanded'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },

    copy: {
      scripts: {
        expand: true,
        cwd: 'bower_components/',
        src: '**/*.js',
        dest: 'js'
      },

      maps: {
        expand: true,
        cwd: 'bower_components/',
        src: '**/*.map',
        dest: 'js'
      },
    },

    uglify: {
      dist: {
        files: {
          'js/app.min.js': ['js/app.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'js/fastclick/lib/fastclick.js',
          'js/analytics.js',
          'js/firehose.js',
          'js/jquery.lightGallery.min.js',
          // 'js/ajaxchimp/jquery.ajaxchimp.min.js',
          'js/facebook.js',
          'js/foundation/js/foundation/foundation.js',
          'js/foundation/js/foundation/foundation.reveal.js',
          'js/init-foundation.js',
          'js/site.js'
        ],

        dest: 'js/app.js',
      },

    },

    scsslint: {
      allFiles: [
        'scss/app.scss',
      ],
      options: {
        colorizeOutput: true
      },
    },

    autoprefixer: {
      no_dest: {
        src: 'css/app.css'
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      markup: {
        files: ['views/*.twig', 'views/**/*.twig'],
        options: {
          livereload: true,
        }
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'autoprefixer'],
        options: {
          livereload: true,
        }
      },

      concat: {
        files: ['js/site.js'],
        tasks: ['concat', 'uglify'],
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.registerTask('build', ['sass', 'autoprefixer', 'coffee']);
  grunt.registerTask('build-svg', ['svgstore']);
  grunt.registerTask('default', ['copy', 'concat', 'uglify', 'watch']);

}
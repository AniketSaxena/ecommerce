// Generated on 2017-06-02 using generator-angular 0.16.0
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });
  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };
  // Define the configuration for all the tasks
  grunt.initConfig({
    aws: grunt.file.readJSON('aws-credentials.json'),
    // Project settings
    yeoman: appConfig,
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35730
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },
    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },
    ngconstant: {
      options: {
        name: 'config',
        dest: 'app/scripts/config.js',
        values: {
          debug: true
        }
      },
      local: {
        constants: {
          ENV: {
            serverURL: 'http://localhost:1337',
            vendorKey: '12fcacee2d11a158c4ac6dcf12bc71eb',
            myGovAPI: '210d0d0cbf2c9c3ede9bda8f25e89533',
            owner: 'AS742HJVZK',
            style: 'delivery',
            mode: 'website',
            type: 'local',
            payPath: '/pay',
            brand: 'chocohollics',
            parseAPIKey: 'MbAe6hoy43d3uInM0TISC1dBePxocl4eLL4B0Tig',
            parseJsKey: 'bdKP5OkzKFPQt4RKURwhK7blDLTr6xScCxNuSPwY',
            parsePath: '/parse',
            webhookURL: 'https://requestb.in/1nu8aqv1',
            successURL: 'http://localhost:9001/#/main/confirm',
            build: 'development',
            vendorId: '8Wm0DoBfqA',
            myGovURL: '//api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?format=json&api-key='
          }
        }
      },
      production: {
        constants: {
          ENV: {
            serverURL: 'https://use.proplco.com',
            vendorKey: '12fcacee2d11a158c4ac6dcf12bc71eb',
            myGovAPI: '210d0d0cbf2c9c3ede9bda8f25e89533',
            owner: '8PmVIkY5sK',
            style: 'delivery',
            mode: 'website',
            type: 'local',
            payPath: '/pay',
            brand: 'chocohollics',
            parseAPIKey: 'MbAe6hoy43d3uInM0TISC1dBePxocl4eLL4B0Tig',
            parseJsKey: 'bdKP5OkzKFPQt4RKURwhK7blDLTr6xScCxNuSPwY',
            parsePath: '/parse',
            webhookURL: 'https://use.proplco.com/pay/update',
            successURL: 'http://chocohollics.com/#/main/confirm',
            build: 'production',
            vendorId: '8Wm0DoBfqA',
            myGovURL: '//api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?format=json&api-key='
          }
        }
      }
    },
    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({ browsers: ['last 1 version'] })
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            // post: {
            //   js: [{
            //     name: 'concat',
            //     createConfig: function(context, block) {
            //       context.options.generated.options = {
            //         sourceMap: true
            //       };
            //     }
            //   }, {
            //     name: 'uglify',
            //     createConfig: function(context, block) {
            //       context.options.generated.options = {
            //         sourceMapIn: '.dist/scripts/' + block.dest.replace('.js', '.js.map'),
            //         mangle: false,
            //         beautify: {
            //           beautify: true
            //         }
            //       };
            //     }
            //   }]
            // }
          }
        }
      }
    },
    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ],
        patterns: {
          js: [
            [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
          ]
        }
      }
    },
    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   options: {
    //     sourceMap: true
    //   },
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   options: {
    //     sourceMap: true
    //   },
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': ['build/scripts/*.js']
    //     }
    //   }
    // },
    concat: {
      js: {
        src: ['.tmp/concat/scripts/scripts.js','.tmp/*.js'],
        dest: '.tmp/concat/scripts/scripts.js'
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    ngtemplates: {
      dist: {
        options: {
          module: 'chocoholicsApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },
    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },
    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.accessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.secretAccessKey %>', // You can also use env variables
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      production: {
        options: {
          bucket: 'chocohollics.com',
          region: 'ap-south-1',
          /*params: {
              ContentEncoding: 'gzip' // applies to all the files!
          },*/
          gzipRename: 'ext', // when uploading a gz file, keep the original extension
          differential: true
        },
        files: [
          { expand: true, cwd: 'public/', src: ['**'], dest: '/', params: { ContentEncoding: 'gzip', CacheControl: 'max-age=3600' } }
        ]
      },
      clean_production: {
        options: {
          bucket: 'chocohollics.com',
          debug: false // Doesn't actually delete but shows log
        },
        files: [
          { dest: '/', action: 'delete' }
        ]
      },
      download_production: {
        options: {
          bucket: 'chocohollics.com'
        },
        files: [
          { dest: '/', cwd: 'backup/', action: 'download' } // Downloads the content of app/ to backup/
        ]
      }
    },
    compress: {
      main: {
        options: {
          pretty: true,
          mode: 'gzip',
          level: 9
        },
        expand: true,
        cwd: 'dist/',
        src: ['**/*'],
        dest: 'public/'
      }
    }
  });
  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'ngconstant:local',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });
  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });
  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);
  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:production',
    'ngtemplates',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat:generated',
    'ngAnnotate',
    'concat:js',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);
  grunt.registerTask('deploy', [
    'compress',
    'aws_s3:production'
  ]);
  grunt.registerTask('default', 'concat cssmin', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);
  grunt.loadNpmTasks('grunt-ng-constant');
};

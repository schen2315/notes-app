// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var router   = require('front-router');
var sequence = require('run-sequence');
var http = require('http');

// Check for --production flag
var isProduction = !!(argv.production);

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  assets: [
    './client/**/*.*',
    '!./client/templates/**/*.*',
    '!./client/assets/{scss,js}/**/*.*'
  ],
  // Sass will check these folders for files when you use @import.
  sass: [
    'client/assets/scss',
    'bower_components/foundation-apps/scss'
  ],
  // These files include Foundation for Apps and its dependencies
  foundationJS: [
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/tether/tether.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/foundation-apps/js/vendor/**/*.js',
    'bower_components/foundation-apps/js/angular/**/*.js',
    '!bower_components/foundation-apps/js/angular/app.js'
  ],
  // These files are for your app's JavaScript
  appJS: [
    'client/assets/js/app.js'
  ],
  //These are the socket.io clientside file 
  socketIoJS : 'client/assets/js/socket.io.js',
  
  //Here are the images
  img : [
      'client/assets/img/bin2.svg',
      'client/assets/img/Capco_logo.jpg',
      'client/assets/img/menu.svg',
      'client/assets/img/plus.svg',
      'client/assets/img/share.svg',
      'client/assets/im/file-empty.svg',
      'client/assets/im/floppy-disk.svg',
      'client/assets/im/search.svg',
  ],
  
  //Where all the magic happens
  ioJS : 'client/assets/js/io.js',
  
  //personal styling options + jquery draggable css
  css : [
          'client/assets/css/notesStyle.css',
          'client/assets/css/jquery-ui.min.css',
          'client/assets/css/jquery-ui.structure.min.css'
        ] ,
  
  //controlling the frontend notes behavior
  notesJS : 'client/assets/js/notesJS.js',
  
  jquery : 'client/assets/js/jquery-2.1.4.min.js',
  
  'jquery-ui' : 'client/assets/js/jquery-ui.min.js',
  
  'jquery.mobile' : 'client/assets/js/jquery.mobile-events.min.js'
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './client/'
  })
    .pipe(gulp.dest('./build'))
  ;
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
  return gulp.src('./client/templates/**/*.html')
    .pipe(router({
      path: 'build/assets/js/routes.js',
      root: 'client'
    }))
    .pipe(gulp.dest('./build/templates'))
  ;
});

// Compiles the Foundation for Apps directive partials into a single JavaScript file
gulp.task('copy:foundation', function(cb) {
  gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./build/assets/js'))
  ;

  // Iconic SVG icons
  gulp.src('./bower_components/foundation-apps/iconic/**/*')
    .pipe(gulp.dest('./build/assets/img/iconic/'))
  ;
  
  //Allen's pictures
  gulp.src(paths.img)
    .pipe(gulp.dest('./build/assets/img/'))
  ;
  
  cb();
});

// Compiles Sass
gulp.task('sass', function () {
  return gulp.src('client/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

//get css to build folder
gulp.task('css', function() {
  return gulp.src(paths.css)
      .pipe(gulp.dest('./build/assets/css/'))
  ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app', 'uglify:socket', 'uglify:io', 'uglify:notes', 'uglify:jquery', 'uglify:jquery-ui', 'uglify:jquery.mobile']);


gulp.task('uglify:jquery.mobile', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths['jquery.mobile'])
    .pipe(uglify)
    .pipe($.concat('jquery-mobile.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});
gulp.task('uglify:jquery', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.jquery)
    .pipe(uglify)
    .pipe($.concat('jquery.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:jquery-ui', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths['jquery-ui'])
    .pipe(uglify)
    .pipe($.concat('jquery-ui.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});


gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:socket', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function(e) {
      console.log(e);
    }));
    
  return gulp.src(paths.socketIoJS)
    .pipe(uglify)
    .pipe($.concat('socket.io.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:io', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function(e) {
      console.log(e);
    }));
    
  return gulp.src(paths.ioJS)
    .pipe(uglify)
    .pipe($.concat('io.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:notes', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function(e) {
      console.log(e);
    }));
    
  return gulp.src(paths.notesJS)
    .pipe(uglify)
    .pipe($.concat('notesJS.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
})

// Starts a test server, which you can view at http://localhost:8080
//take this out and swap for an express server.
gulp.task('server', ['build'], function() {
    /*
  gulp.src('./build')
    .pipe($.webserver({
      port: 8080,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }));
    */

        var express = require('express');
        var sockets = require('socket.io');
        var path = require('path');
        var http = require('http');
        var response = require('./ioserver');
    
        var app = express();
        app.use(express.static(path.join(__dirname, '/build/')));
        app.set('port', 8080);
    
        var server = http.createServer(app);
    
        server.listen(8080);
        
        var io = sockets(server);
        
        console.log('hey')
        io.on('connection', response.connection);
        
        

});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', ['copy', 'copy:foundation', 'sass', 'css', 'uglify'], 'copy:templates', cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify:app']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['copy:templates']);
});

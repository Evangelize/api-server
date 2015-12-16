// gulpfile.js
var gulp = require('gulp'),
    exec = require('child_process').exec,
    runSequence = require('run-sequence'),
    nodemon = require('gulp-nodemon');

gulp.task(
  'dev',
  function(callback) {
    runSequence(
      'build-dev',
      'nodemon',
      callback
    );
  }
);

gulp.task(
  'build-dev',
  function(cb) {
    exec('npm run build-dev', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
);

gulp.task(
  'nodemon',
  function () {
    nodemon(
      {
        script: 'index.js',
        ext: 'html js',
        watch : [
          'src/containers',
          'src/models',
          'routes',
          'src/server.js'
        ]
      }
    )
    .on(
      'restart',
      function () {
        console.log('restarted!')
      }
    );
  }
);

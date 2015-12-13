// gulpfile.js
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task(
  'develop',
  function () {
    nodemon(
      {
        script: 'index.js',
        ext: 'html js',
        watch : [
          'src/containers',
          'src/models',
          'routes',
          'webpack/devServer.js'
        ]
      }
    )
    .on(
      'restart',
      function () {
        console.log('restarted!')
      }
    )
  }
);

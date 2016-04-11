var gulp = require('gulp'),
    Server = require('karma').Server;

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start()
});

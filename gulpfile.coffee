gulp = require 'gulp'
argv = require('minimist')(process.argv.slice(2))
karma = require('karma').server

gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
notify = require 'gulp-notify'

config =
  banner: """
/* Metovular
 * Coming soon
 */
  """
  paths: 'src/**'
  outputDir: 'dist/'

gulp.task 'default', ['karma-build', 'build']

gulp.task 'karma-build', ['karma']

gulp.task 'karma', (done) ->
  karmaConfig =
    singleRun: true
    autoWatch: false
    browsers : if argv.browsers then argv.browsers.trim().split(',') else ['Chrome']
    configFile: __dirname + '/config/karma.conf.coffee'

  gutil.log 'Running tests with karma...'
  karma.start karmaConfig, ( -> done() )

gulp.task 'karma-watch', (done) ->
  karma.start
    singleRun: false
    autoWatch: true
    configFile: __dirName + '/config/karma.conf.coffee'
  , -> done()

gulp.task 'build', ->
  gutil.log 'Compiling source...'
  gulp.src(config.paths)
  .pipe(coffee(sourceMap: false))
  .on('error', notify.onError( (error) -> error.message ))
  .pipe(concat('metovular.js'))
  .pipe(gulp.dest(config.outputDir))
  gutil.log 'Done'

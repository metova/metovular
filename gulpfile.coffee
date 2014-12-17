gulp = require 'gulp'
argv = require('minimist')(process.argv.slice(2))
karma = require('karma').server

gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
notify = require 'gulp-notify'
jade = require 'gulp-jade'
templateCache = require 'gulp-angular-templatecache'
merge = require 'merge-stream'
gulpif = require 'gulp-if'

config =
  banner: """
/* Metovular
 * Coming soon
 */
  """
  source: 'src/**/*.{coffee,js}'
  templates: 'src/**/*.{html,jade}'
  outputDir: './'

gulp.task 'default', ['karma-build', 'build']

gulp.task 'karma-build', ['karma']

gulp.task 'karma', (done) ->
  karmaConfig =
    singleRun: true
    autoWatch: false
    browsers : if argv.browsers then argv.browsers.trim().split(',') else ['PhantomJS']
    configFile: __dirname + '/config/karma.conf.coffee'

  gutil.log 'Running tests with karma...'
  karma.start karmaConfig, ( -> done() )

gulp.task 'karma-watch', (done) ->
  karma.start
    singleRun: false
    autoWatch: true
    configFile: __dirname + '/config/karma.conf.coffee'
  , -> done()

gulp.task 'build', ->
  gutil.log 'Compiling source...'
  js = gulp.src(config.source)
  .pipe(gulpif(/[.]coffee$/, coffee(sourceMap: false)))
  .on('error', notify.onError( (error) -> error.message ))
  gutil.log 'Done'

  gutil.log 'Compiling templates...'
  html = gulp.src(config.templates)
  .pipe(gulpif(/[.]jade$/, jade()))
  .on('error', notify.onError( (error) -> error.message ))
  .pipe(templateCache(standalone: true))
  gutil.log 'Done'

  merge(js, html)
  .pipe(concat('metovular.js'))
  .pipe(gulp.dest(config.outputDir))

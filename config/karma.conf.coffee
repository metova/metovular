module.exports = (config) ->
  config.set

    preprocessors:
      '**/*.coffee': ['coffee']
      '**/*.jade': ['jade', 'ng-html2js']

    basePath: '../'
    frameworks: ['jasmine']
    files: [
      'bower_components/angular/angular.js'
      'bower_components/angular-mocks/angular-mocks.js'
      'bower_components/angular-resource/angular-resource.js'
      'bower_components/lodash/lodash.js'
      'bower_components/jquery/jquery.js'
      'bower_components/select2/select2.js'
      'bower_components/ui-select/dist/select.js'
      'bower_components/rxjs/dist/rx.js'
      'src/**'
    ].concat(['tests/**.tests.coffee', 'tests/**.tests.js'])

    port: 9876
    reporters: ['progress', 'junit']
    colors: true

    junitReporter:
      outputFile: 'reports/jasmine.xml'
      suite: ''

    ngHtml2JsPreprocessor:
      moduleName: 'templates'

    autoWatch: false
    singleRun: false
    browsers: ['PhantomJS']

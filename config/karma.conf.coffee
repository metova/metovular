module.exports = (config) ->
  config.set

    preprocessors:
      '**/*.coffee': ['coffee']

    basePath: '../'
    frameworks: ['jasmine']
    files: [
      'bower_components/angular/angular.js'
      'bower_components/angular-mocks/angular-mocks.js'
      'bower_components/angular-resource/angular-resource.js'
      'bower_components/lodash/dist/lodash.js'
      'bower_components/jquery/dist/jquery.js'
      'bower_components/select2/select2.js'
      'bower_components/ui-select/dist/select.js'
    ].concat(['metovular.js', 'tests/**.tests.coffee', 'tests/**.tests.js'])

    port: 9876
    reporters: ['progress', 'junit']
    colors: true

    junitReporter:
      outputFile: 'reports/jasmine.xml'
      suite: ''

    autoWatch: false
    singleRun: false
    browsers: ['Chrome']
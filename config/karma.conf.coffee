module.exports = (config) ->
  config.set
    preprocessors:
      '**/*.coffee': ['coffee']
    basePath: '../'
    frameworks: ['jasmine']
    files: [
      'bower_components/angular/angular.js'
      'bower_components/angular-resource/angular-resource.js'
    ].concat(['src/**', 'tests/**.tests.coffee', 'tests/**.tests.js'])

    port: 9876
    reporters: ['progress', 'junit']
    colors: true

    junitReporter:
      outputFile: 'reports/jasmine.xml'
      suite: ''

    autoWatch: false
    singleRun: false
    browsers: ['Chrome']
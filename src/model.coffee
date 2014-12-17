app = angular.module 'metovular.model', []

app.factory 'Model', ->
  class Model
    constructor: (json) ->
      _.extend @, json
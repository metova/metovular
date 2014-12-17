app = angular.module 'metovular.services.http', []

app.factory 'HttpService', [ '$resource', 'Model', ($resource, Model) ->
  class HttpService
    constructor: (@url, @indexRoot) ->
      @service = $resource @url, @defaultParams(), @actionOptions()

    jsonToModel: (data) ->
      new Model(data)

    all: (params) ->
      @service.query(params).$promise.then (data) =>
        @_arrayToModel(data)

    find: (id) ->
      @service.get(id: id).$promise.then (data) =>
        @_oneToModel(data)

    create: (params) ->
      @service.save(params).$promise.then (data) =>
        @_oneToModel(data)

    update: (params) ->
      @service.update(params).$promise.then (data) =>
        @_oneToModel(data)

    delete: (params) =>
      @service.delete(params).$promise.then (data) =>
        @_oneToModel(data)

    defaultParams: ->
      id: '@id'

    actionOptions: ->
      query:
        method: 'GET'
        isArray: true
      get:
        method: 'GET'
      save:
        method: 'POST'
      update:
        method: 'PUT'
      delete:
        method: 'DELETE'

    _arrayToModel: (data) =>
      response = []
      json = angular.fromJson(data)
      angular.forEach (if @indexRoot? then json[@indexRoot] else json), (item) =>
        response.push @jsonToModel(item)
      response

    _oneToModel: (data) =>
      @jsonToModel angular.fromJson(data)
]
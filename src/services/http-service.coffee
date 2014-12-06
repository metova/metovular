app = angular.module 'metovular.services.http', []

app.factory 'HttpService', [ '$resource', 'Model', ($resource, Model) ->
  class HttpService
    constructor: (@url, @indexRoot) ->
      @service = $resource @url, @defaultParams(), @actionOptions()

    jsonToModel: (data) ->
      new Model(data)

    all: (params) ->
      @service.query(params).$promise

    find: (id) ->
      @service.get(id: id).$promise

    create: (params) ->
      @service.save(params).$promise

    update: (params) ->
      @service.update(params).$promise

    delete: (params) =>
      @service.delete(params).$promise

    defaultParams: ->
      id: '@id'

    actionOptions: ->
      query:
        method: 'GET'
        isArray: true
        transformResponse: @_arrayToModel
      get:
        method: 'GET'
        transformResponse: @_oneToModel
      save:
        method: 'POST'
        transformResponse: @_oneToModel
      update:
        method: 'PUT'
        transformResponse: @_oneToModel
      delete:
        method: 'DELETE'
        transformResponse: @_oneToModel

    _arrayToModel: (data) =>
      response = []
      json = angular.fromJson(data)
      angular.forEach (if @indexRoot? then json[@indexRoot] else json), (item) =>
        response.push @jsonToModel(item)
      response

    _oneToModel: (data) =>
      @jsonToModel angular.fromJson(data)
]
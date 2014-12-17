app = angular.module 'metovular.services.query-cache', []

app.factory 'QueryCacheService', [ '$q', 'HttpService', ($q, HttpService) ->
  class QueryCacheService extends HttpService
    constructor: (@url, @indexRoot, @hardDelete) ->
      super @url, @indexRoot
      @initCache()

    initCache: ->
      @cache =
        items: []
        byQuery: {}
        promises: {}

    all: (params, force) ->
      params or= {}
      queryString = JSON.stringify(params)
      if @cache.byQuery[queryString]? and !force
        $q.when @cache.byQuery[queryString]
      else if @cache.promises[queryString]? and !force
        @cache.promises[queryString]
      else
        @cache.promises[queryString] = super(params).then (items) =>
          delete @cache.promises[queryString]
          @_updateItems(items)
          itemIds = items.map (i) -> i.id
          @cache.byQuery[queryString] or= @cache.items.filter( (item) => item.id in itemIds )
        , (err) =>
          err

    find: (id) ->
      item = _.find @cache.items, { id: parseInt id }
      if item?
        $q.when(item)
      else
        super(id).then (data) =>
          @_updateItem data

    create: (params) ->
      super(params).then (data) =>
        @_updateItem data

    update: (params) ->
      super(params).then (data) =>
        @_updateItem data

    delete: (params) ->
      super(params).then (data) =>
        if @hardDelete
          _.remove @cache.items, params
          _.keys(@cache.byQuery).forEach (query) =>
            _.remove @cache.byQuery[query], params
        else
          @_updateItem data
        data

    _updateItems: (items) ->
      items.forEach (item) => @_updateItem(item)

      @cache.lastUpdated = moment().unix()

    _updateItem: (item) ->
      cachedItem = _.find(@cache.items, { id: item.id })
      if cachedItem?
        _.extend cachedItem, item
        cachedItem
      else
        @cache.items.push item
        _.keys(@cache.byQuery).forEach (query) =>
          match = @_matchQuery(query, item)
          @cache.byQuery[query].push item if match
        item

    _matchQuery: (query, item) ->
      params = JSON.parse query
      _.keys(params).map( (key) =>
        if "#{item[key]}" is "#{params[key]}" or @customMatchers()[key]?(item, params)
          0
        else
          1
      ).reduce(( (a,b) -> a + b ), 0) is 0

    customMatchers: ->
      {}
]
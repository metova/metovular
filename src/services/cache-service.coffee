app = angular.module 'metovular.services.cache', []

app.factory 'CacheService', [ '$q', 'HttpService', ($q, HttpService) ->
  class CacheService extends HttpService
    constructor: (@url, @indexRoot, @maxAge, @useLocalStorage) ->
      super @url, @indexRoot
      @maxAge or= 9000

      if !localStorage.getItem(@url) or !@useLocalStorage
        @initCache()
      @loadCache()

      @_deferreds = []

    initCache: ->
      @cache =
        url: @url
        lastUpdated: null
        items: []
        cacheVersion: 1
      @saveCache()

    loadCache: ->
      return if !@useLocalStorage
      @cache = JSON.parse(localStorage.getItem(@url))

    saveCache: ->
      return if !@useLocalStorage
      localStorage.setItem(@url, JSON.stringify(@cache))

    all: (params) ->
      params or= {}
      if @cache.lastUpdated? && moment().unix() - @cache.lastUpdated < @maxAge
        console.log 'Returning cached items for ' + @url
        $q.when(@_filterItems(params))
      else if @_promise?
        console.log 'Request in progress, returining child promise'
        deferred = $q.defer()
        @_deferreds.push deferred
        deferred.promise.then (items) =>
          @_updateItems(items)
          @_filterItems(params)
        deferred.promise
      else
        console.log 'Making network request for ' + @url
        @_promise = super().then (items) =>
          @_promise = null
          @_updateItems(items)

          @_deferreds.forEach (d) -> d.resolve(items)
          @_deferreds.length = 0
          @_filterItems(params)
        , (err) =>
          @_deferreds.forEach (d) -> d.reject(err)
          @_deferreds.length = 0
          err

    find: (id) ->
      item = _.find @cache.items, { id: parseInt id }
      if item && @cache.lastUpdated? && moment().unix() - @cache.lastUpdated < @maxAge
        console.log 'Returning cached item'
        $q.when(item)
      else
        console.log 'Making network request for item'
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
        @_removeItem data
        data

    _filterItems: (params) ->
      console.log '_filterItems'
      console.log params
      @cache.items.filter( (item) ->
        _.keys(params).map( (key) ->
          if item[key] is params[key]
            0
          else
            1
        ).reduce(( (a,b) -> a + b ), 0) is 0
      )

    _updateItems: (items) ->
      items.forEach (item) => @_updateItem(item)

      @cache.lastUpdated = moment().unix()
      @saveCache()

    _updateItem: (item) ->
      cachedItem = _.find(@cache.items, { id: item.id })
      if cachedItem?
        _.extend cachedItem, item
        cachedItem
      else
        @cache.items.push item

    _removeItem: (item) ->
      _.remove @cache.items, { id: item.id }
]
describe 'QueryCacheService', ->
  beforeEach angular.mock.module 'metovular'

  beforeEach angular.mock.inject ($injector, QueryCacheService, $resource, Model) ->
    @$httpBackend = $injector.get '$httpBackend'
    @$resource = $resource
    @QueryCacheService = QueryCacheService
    @Model = Model

  describe 'the constructor', ->

  describe '.all', ->

    it 'should make and cache a new request by the params'

    it 'should not make the request if that request is cached'

    it 'should make a new request if force is passed'

  describe '.find', ->
    it 'should return a cached item first'

    it 'should make the request if not found'

  describe '.create', ->
    it 'should add the cached item to matching queries'

  describe '.update', ->
    it 'should update the cached item'

  describe '.delete', ->
    it 'should update the cached item'

    it 'should remove the cached item if hardDelete is set'

  describe '._updateItems', ->
    it 'should update each item'

  describe '._updateItem', ->
    describe 'if the item is already cached', ->
      it 'should update the existing item'

    describe 'if the item is not already cached', ->
      it 'should add the item to the cache'

      it 'should add the item to any matching queries'

    describe '._matchQuery', ->
      beforeEach ->
        @service = new @QueryCacheService '/api/endpoint'

      it 'should test whether the item matches the query', ->
        expect(@service._matchQuery(JSON.stringify(id: 1), { id: 1, otherKey: 'otherValue' })).toBeTruthy()
        expect(@service._matchQuery(JSON.stringify(id: 2), { id: 1, otherKey: 'otherValue' })).toBeFalsy()

        expect(@service._matchQuery(JSON.stringify(otherKey: 'otherValue'), { id: 1, otherKey: 'otherValue' })).toBeTruthy()
        expect(@service._matchQuery(JSON.stringify(id: 1, otherKey: 'otherValue'), { id: 1, otherKey: 'otherValue' })).toBeTruthy()
        expect(@service._matchQuery(JSON.stringify(id: 2, otherKey: 'otherValue'), { id: 1, otherKey: 'otherValue' })).toBeFalsy()

      it 'should use any defined custom matchers', ->
        @service.customMatchers = ->
          trueKey: (item, params) ->
            true
          falseKey: (item, params) ->
            false

        expect(@service._matchQuery(JSON.stringify(trueKey: 'alwaysTrue'), { id: 1 })).toBeTruthy()
        expect(@service._matchQuery(JSON.stringify(falseKey: 'alwaysFalse'), { id: 1 })).toBeFalsy()
        expect(@service._matchQuery(JSON.stringify(trueKey: 'alwaysTrue', falseKey: 'alwaysFalse'), { id: 1 })).toBeFalsy()

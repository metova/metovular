describe 'HttpService', ->
  beforeEach angular.mock.module('metovular')

  beforeEach angular.mock.inject ($injector, HttpService, $resource, Model) ->
    @$httpBackend = $injector.get '$httpBackend'
    @$resource = $resource
    @HttpService = HttpService
    @Model = Model

  describe 'the constructor', ->
    it 'should set the @url and @indexRoot local variables', ->
      HttpService = new @HttpService('/api/endpoint')
      expect(HttpService.url).toEqual '/api/endpoint'

      HttpService = new @HttpService('/api/endpoint', 'endpoints')
      expect(HttpService.indexRoot).toEqual 'endpoints'

  describe '.jsonToModel', ->
    it 'should wrap the provided json in a model object', ->
      HttpService = new @HttpService '/api/endpoint'
      result = HttpService.jsonToModel id: 1
      expect(result instanceof @Model).toBeTruthy()
      expect(result.id).toEqual 1

  describe '._arrayToModel', ->
    describe 'with an indexRoot', ->
      it 'should unwrap the array and convert to models', ->
        HttpService = new @HttpService '/api/endpoint', 'endpoints'
        input =
          endpoints: [
            { id: 1 }
            { id: 2 }
          ]

        result = HttpService._arrayToModel input
        expect(result instanceof Array).toBeTruthy()
        expect(result.length).toEqual 2
        result.forEach (item, $index) =>
          expect(item instanceof @Model).toBeTruthy()
          expect(item.id).toEqual $index + 1

    describe 'without an indexRoot', ->
      it 'should convert the array to models', ->
        HttpService = new @HttpService '/api/endpoint'
        input = [
          { id: 1 }
          { id: 2 }
        ]

        result = HttpService._arrayToModel input
        expect(result instanceof Array).toBeTruthy()
        expect(result.length).toEqual 2
        result.forEach (item, $index) =>
          expect(item instanceof @Model).toBeTruthy()
          expect(item.id).toEqual $index + 1

    describe '._oneToModel', ->
      it 'wraps the data in a model object', ->
        HttpService = new @HttpService '/api/endpoint'
        input = id: 1
        result = HttpService._oneToModel input
        expect(result instanceof @Model).toBeTruthy()
        expect(result.id).toEqual 1

    describe 'querying methods', ->
      beforeEach ->
        @httpService = new @HttpService '/api/endpoints/:id'

      afterEach ->
        @$httpBackend.verifyNoOutstandingRequest()
        @$httpBackend.verifyNoOutstandingExpectation()

      describe '.all', ->
        it 'should GET /api/endpoints and return the promise', ->
          @$httpBackend.expectGET('/api/endpoints').respond 200
          result = @httpService.all()
          expect(result.then?).toBeTruthy()
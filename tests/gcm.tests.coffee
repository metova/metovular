describe '$gcm', ->
  beforeEach module 'metovular.services.gcm'

  beforeEach inject ->
    @PushNotification = jasmine.createSpyObj('PushNotification', ['init'])
    @PushEmitter = new class PushEmitter
      constructor: ->
        @callbacks = {}

      on: (event, fn) ->
        @callbacks[event] ||= []
        @callbacks[event].push fn

      fire: (event, data) ->
        return unless @callbacks[event]?.length
        _.each @callbacks[event], (fn) ->
          fn(data)

    window.PushNotification = @PushNotification
    @PushNotification.init.and.returnValue @PushEmitter

    spyOn(@PushEmitter, 'on').and.callThrough()

  beforeEach inject ($gcm) ->
    @subject = $gcm

  it 'sets up initial state', ->
    expect(@subject.push).toBeFalsy()
    expect(@subject.registration).toBeTruthy()
    expect(@subject.registration.subscribe).toBeTruthy()
    expect(@subject.registration.onNext).toBeTruthy()
    expect(@subject.registration.onError).toBeTruthy()
    expect(@subject.notifications).toBeTruthy()
    expect(@subject.notifications.subscribe).toBeTruthy()
    expect(@subject.notifications.onNext).toBeTruthy()
    expect(@subject.notifications.onError).toBeTruthy()

  describe '#init', ->
    it 'calls init on PushNotification', ->
      @subject.init 'hello'
      expect(@PushNotification.init).toHaveBeenCalledWith
        android:
          senderID: 'hello'
        ios:
          senderID: 'hello'
      expect(@subject.push).toEqual @PushEmitter

    it 'sets up the registration handler', ->
      @subject.init 'hello'
      expect(@PushEmitter.on).toHaveBeenCalled()
      expect(@PushEmitter.on.calls.all()[0].args[0]).toEqual 'registration'
      spy = jasmine.createSpy('hello')
      @subject.registration.subscribe (data) ->
        spy(data)
      @PushEmitter.fire 'registration', 'some data'
      expect(spy).toHaveBeenCalledWith('some data')

    it 'sets up the error handler', ->
      @subject.init 'hello'
      expect(@PushEmitter.on).toHaveBeenCalled()
      expect(@PushEmitter.on.calls.all()[1].args[0]).toEqual 'error'

    it 'sets up the notification handler', ->
      @subject.init 'hello'
      expect(@PushEmitter.on).toHaveBeenCalled()
      expect(@PushEmitter.on.calls.all()[2].args[0]).toEqual 'notification'
      spy = jasmine.createSpy('hello')
      @subject.notifications.subscribe (data) ->
        spy(data)
      @PushEmitter.fire 'notification', 'some data'
      expect(spy).toHaveBeenCalledWith('some data')

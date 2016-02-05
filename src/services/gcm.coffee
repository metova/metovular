angular.module 'metovular.services.gcm', []
.factory '$gcm', ->
  new class GCM
    constructor: ->
      @push = null
      @registration = new Rx.Subject()
      @notifications = new Rx.Subject()

    init: (senderID) ->
      @push = PushNotification.init
        android:
          senderID: senderID
        ios:
          senderID: senderID

      @push.on 'registration', (data) =>
        console.log '$gcm:registration', data
        @registration.onNext data

      @push.on 'error', (data) =>
        console.log '$gcm:error', data
        @registration.onError data

      @push.on 'notification', (data) =>
        console.log '$gcm:notification', data
        @notifications.onNext data

app = angular.module 'metovular.formFor', [ 'classy', 'ui.select', 'templates' ]

app.directive 'maFormFor', [ ->
  {
    restrict: 'E'
    scope:
      getItem: '&item'
      getFields: '&fields'
      getOptions: '&options'
      onSubmit: '&?submit'
      onCancel: '&?cancel'
    templateUrl: 'formFor/form-for-tpl.html'
    controller: 'MAFormForCtrl'
    transclude: true
  }
]

app.classy.controller
  name: 'MAFormForCtrl'
  inject: [
    '$scope'
  ]

  init: ->
    @defaultParams =
      type: 'text'
      required: false
      if: true
      optionTemplate: '{{ option.label }}'

    @defaultOptions =
      showSubmit: true
      showCancel: false

  getKeys: ->
    _.keys(@$.getFields())

  getParam: (key, param) ->
    if @$.getFields()[key]?[param]?
      @_getValue(@$.getFields()[key]?[param], key)
    else
      @_getValue(@defaultParams[param], key)

  getOption: (key) ->
    if @$.getOptions()?[key]?
      @$.getOptions()?[key]
    else
      @defaultOptions[key]

  getFormClass: ->
    @$.getOptions()?.formClass

  getLabelClass: ->
    @$.getOptions()?.labelClass

  getControlClass: ->
    @$.getOptions()?.controlClass

  _getValue: (param, key) ->
    if typeof param is 'function'
      param(@$.getItem(), key)
    else
      param

  getSubmitValue: ->
    "#{ if @$.getItem().id? then 'Update' else 'Create' } #{@$.getItem().type}"

  submit: ->
    @$.onSubmit?(@$.getItem())

  cancel: ->
    @$.onCancel?(@$.getItem())

  _getItem: ->
    @$.getItem()

app.directive 'maInput', [ ->
  restrict: 'E'
  templateUrl: 'formFor/input-tpl.html'
  require: '^?maFormFor'
  scope: true
  link: ($scope, element, attributes, FormForCtrl) ->
    _cacheParams = {}
    defaultParams =
      type: 'text'
      required: 'false'
      if: true
      maxlength: 255
      label: ->
        attributes.label || attributes.for
      _options: (param, key) =>
        _cacheKey key, param, =>
          val = JSON.parse $scope.getParam('options')
          val.map (v) ->
            if typeof v is 'object'
              v
            else
              { label: v, value: v }

    defaultOptions = {}

    _getValue = (something) ->
      if typeof something is 'function'
        something()
      else
        something

    _cacheKey = (key, param, value) ->
      if !_cacheParams[key]?[param]?
        _cacheParams[key] or= {}
        $scope.$watchCollection ( -> JSON.stringify value() ), (newVal) =>
          _cacheParams[key][param] = value()
      _cacheParams[key][param] or= value()

    $scope.getItem = ->
      if FormForCtrl?
        FormForCtrl._getItem()
      else
        $scope.$eval attributes.item

    $scope.getParam = (key) ->
      if attributes[key]?
        attributes[key]
      else
        _getValue(defaultParams[key])

    $scope.getOption = (key) ->
      return attributes.options[key] if attributes.options?.key?
      return FormForCtrl.getOption(key) if FormForCtrl?
      defaultOptions[key]
]
app = angular.module 'metovular.formFor', [ 'ui.select', 'templates' ]

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

app.controller 'MAFormForCtrl', ($scope) ->
  defaultParams =
    type: 'text'
    required: false
    if: true
    optionTemplate: '{{ option.label }}'

  defaultOptions =
    showSubmit: true
    showCancel: false

  $scope.getKeys = ->
    _.keys($scope.getFields())

  $scope.getParam = (key, param) ->
    if $scope.getFields()[key]?[param]?
      $scope._getValue($scope.getFields()[key]?[param], key)
    else
      $scope._getValue(defaultParams[param], key)

  $scope.getOption = (key) ->
    if $scope.getOptions()?[key]?
      $scope.getOptions()?[key]
    else
      defaultOptions[key]

  $scope.getFormClass = ->
    $scope.getOptions()?.formClass

  $scope.getLabelClass = ->
    $scope.getOptions()?.labelClass

  $scope.getControlClass = ->
    $scope.getOptions()?.controlClass

  $scope._getValue = (param, key) ->
    if typeof param is 'function'
      param($scope.getItem(), key)
    else
      param

  $scope.getSubmitValue = ->
    "#{ if $scope.getItem().id? then 'Update' else 'Create' } #{$scope.getItem().type}"

  $scope.submit = ->
    $scope.onSubmit?($scope.getItem())

  $scope.cancel = ->
    $scope.onCancel?($scope.getItem())

  $scope._getItem = ->
    $scope.getItem()

  @getOption = $scope.getOption
  @_getItem = $scope._getItem

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
      id: ->
        attributes.for
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
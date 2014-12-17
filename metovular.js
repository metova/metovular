(function() {
  angular.module('metovular', ['ngResource', 'metovular.model', 'metovular.services', 'metovular.formFor']);

}).call(this);

(function() {
  var app;

  app = angular.module('metovular.model', []);

  app.factory('Model', function() {
    var Model;
    return Model = (function() {
      function Model(json) {
        _.extend(this, json);
      }

      return Model;

    })();
  });

}).call(this);

angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("formFor/form-for-tpl.html","<form id=\"{{ getItem().type.toLowerCase() }}-form\" ng-submit=\"submit()\" ng-transclude=\"\" class=\"{{ getFormClass() }}\"></form><div class=\"form-group\"><button ng-click=\"submit()\" ng-if=\"getOption(\'showSubmit\')\" class=\"btn btn-primary pull-right\">{{ getSubmitValue() }}</button><button ng-click=\"cancel($event)\" ng-if=\"getOption(\'showCancel\')\" class=\"btn btn-default\">Cancel</button><div class=\"clearfix\"></div></div>");
$templateCache.put("formFor/input-tpl.html","<div ng-class=\"{ \'has-error\': getItem().errors[getParam(\'for\')] }\" ng-if=\"getParam(\'if\')\" class=\"form-group\"><label for=\"{{ getParam(\'for\') }}\" class=\"control-label {{ getOption(\'labelClass\') }}\">{{ getParam(\'label\') }}</label><div ng-switch=\"getParam(\'type\')\" class=\"{{ getOption(\'controlClass\') }}\"><input id=\"{{ getParam(\'for\') }}\" type=\"{{ getParam(\'type\') }}\" maxlength=\"{{ getParam(\'maxlength\') }}\" ng-required=\"{{ !!getParam(\'required\') }}\" ng-model=\"getItem()[getParam(\'for\')]\" placeholder=\"{{ getParam(\'placeholder\') }}\" ng-switch-default=\"\" class=\"form-control\"/><input id=\"{{ getParam(\'for\') }}\" type=\"text\" maxlength=\"10\" ng-required=\"{{ !!getParam(\'required\') }}\" ng-model=\"getItem()[getParam(\'for\')]\" placeholder=\"{{ getParam(\'placeholder\') }}\" ng-datepicker=\"\" ng-switch-when=\"datepicker\" class=\"form-control\"/><div id=\"{{ getParam(\'for\') }}\" ng-switch-when=\"radio-buttons\" class=\"btn-group btn-group-justified\"><label ng-model=\"getItem()[getParam(\'for\')]\" btn-radio=\"button.value\" ng-repeat=\"button in getParam(\'_options\') track by $index\" class=\"btn btn-default\">{{ button.label }}</label></div><div id=\"{{ getParam(\'for\') }}\" ng-switch-when=\"platform-check-buttons\" class=\"btn-group\"><label ng-model=\"getItem()[getParam(\'for\')][button.value]\" btn-radio=\"button.value\" btn-checkbox=\"btn-checkbox\" ng-repeat=\"button in getParam(\'_options\') track by $index\" class=\"btn btn-default\"><platform-icon data=\"button.label\"></platform-icon></label></div><div ng-switch-when=\"select2\"><ui-select id=\"{{ getParam(\'for\') }}\" name=\"{{ getParam(\'for\') }}\" ng-model=\"getItem()[getParam(\'for\')]\" theme=\"select2\" ng-required=\"{{ !!getParam(\'required\') }}\" class=\"form-control\"><ui-select-match placeholder=\"Select from the list...\">{{ $select.selected.label }}</ui-select-match><ui-select-choices repeat=\"option.value as option in getParam(\'_options\') | filter:$select.search\"><div ng-bind-html=\"option.label | highlight: $select.search\"></div></ui-select-choices></ui-select></div><div ng-switch-when=\"select2-multi\"><ui-select id=\"{{ getParam(\'for\') }}\" name=\"{{ getParam(\'for\') }}\" ng-model=\"getItem()[getParam(\'for\')]\" theme=\"select2\" ng-required=\"{{ !!getParam(\'required\') }}\" multiple=\"multiple\" class=\"form-control\"><ui-select-match placeholder=\"Select from the list...\">{{ $item.label }}</ui-select-match><ui-select-choices repeat=\"option.value as option in getParam(\'_options\') | filter:$select.search\"><div ng-bind-html=\"option.label | highlight: $select.search\"></div></ui-select-choices></ui-select></div><select id=\"{{ getParam(\'for\') }}\" name=\"{{ getParam(\'for\') }}\" ng-model=\"getItem()[getParam(\'for\')]\" ng-required=\"{{ !!getParam(\'required\') }}\" ng-options=\"option.value as option.label for option in getParam(\'_options\')\" ng-switch-when=\"select\" class=\"form-control\"></select><div><span ng-repeat=\"error in getItem().errors[getParam(\'for\')]\" class=\"help-block\">{{ error }}</span></div></div></div>");}]);
(function() {
  var app;

  app = angular.module('metovular.formFor', ['classy', 'ui-select']);

  app.directive('maFormFor', [
    function() {
      return {
        restrict: 'E',
        scope: {
          getItem: '&item',
          getFields: '&fields',
          getOptions: '&options',
          onSubmit: '&?submit',
          onCancel: '&?cancel'
        },
        templateUrl: 'formFor/form-for-tpl.html',
        controller: 'MAFormForCtrl',
        transclude: true
      };
    }
  ]);

  app.classy.controller({
    name: 'MAFormForCtrl',
    inject: ['$scope'],
    init: function() {
      this.defaultParams = {
        type: 'text',
        required: false,
        "if": true,
        optionTemplate: '{{ option.label }}'
      };
      return this.defaultOptions = {
        showSubmit: true,
        showCancel: false
      };
    },
    getKeys: function() {
      return _.keys(this.$.getFields());
    },
    getParam: function(key, param) {
      var _ref, _ref1;
      if (((_ref = this.$.getFields()[key]) != null ? _ref[param] : void 0) != null) {
        return this._getValue((_ref1 = this.$.getFields()[key]) != null ? _ref1[param] : void 0, key);
      } else {
        return this._getValue(this.defaultParams[param], key);
      }
    },
    getOption: function(key) {
      var _ref, _ref1;
      if (((_ref = this.$.getOptions()) != null ? _ref[key] : void 0) != null) {
        return (_ref1 = this.$.getOptions()) != null ? _ref1[key] : void 0;
      } else {
        return this.defaultOptions[key];
      }
    },
    getFormClass: function() {
      var _ref;
      return (_ref = this.$.getOptions()) != null ? _ref.formClass : void 0;
    },
    getLabelClass: function() {
      var _ref;
      return (_ref = this.$.getOptions()) != null ? _ref.labelClass : void 0;
    },
    getControlClass: function() {
      var _ref;
      return (_ref = this.$.getOptions()) != null ? _ref.controlClass : void 0;
    },
    _getValue: function(param, key) {
      if (typeof param === 'function') {
        return param(this.$.getItem(), key);
      } else {
        return param;
      }
    },
    getSubmitValue: function() {
      return "" + (this.$.getItem().id != null ? 'Update' : 'Create') + " " + (this.$.getItem().type);
    },
    submit: function() {
      var _base;
      return typeof (_base = this.$).onSubmit === "function" ? _base.onSubmit(this.$.getItem()) : void 0;
    },
    cancel: function() {
      var _base;
      return typeof (_base = this.$).onCancel === "function" ? _base.onCancel(this.$.getItem()) : void 0;
    },
    _getItem: function() {
      return this.$.getItem();
    }
  });

  app.directive('maInput', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'formFor/input-tpl.html',
        require: '^?maFormFor',
        scope: true,
        link: function($scope, element, attributes, FormForCtrl) {
          var defaultOptions, defaultParams, _cacheKey, _cacheParams, _getValue;
          _cacheParams = {};
          defaultParams = {
            type: 'text',
            required: 'false',
            "if": true,
            maxlength: 255,
            label: function() {
              return attributes.label || attributes["for"];
            },
            _options: (function(_this) {
              return function(param, key) {
                return _cacheKey(key, param, function() {
                  var val;
                  val = JSON.parse($scope.getParam('options'));
                  return val.map(function(v) {
                    if (typeof v === 'object') {
                      return v;
                    } else {
                      return {
                        label: v,
                        value: v
                      };
                    }
                  });
                });
              };
            })(this)
          };
          defaultOptions = {};
          _getValue = function(something) {
            if (typeof something === 'function') {
              return something();
            } else {
              return something;
            }
          };
          _cacheKey = function(key, param, value) {
            var _base, _ref;
            if (((_ref = _cacheParams[key]) != null ? _ref[param] : void 0) == null) {
              _cacheParams[key] || (_cacheParams[key] = {});
              $scope.$watchCollection((function() {
                return JSON.stringify(value());
              }), (function(_this) {
                return function(newVal) {
                  return _cacheParams[key][param] = value();
                };
              })(this));
            }
            return (_base = _cacheParams[key])[param] || (_base[param] = value());
          };
          $scope.getItem = function() {
            if (FormForCtrl != null) {
              return FormForCtrl._getItem();
            } else {
              return $scope.$eval(attributes.item);
            }
          };
          $scope.getParam = function(key) {
            if (attributes[key] != null) {
              return attributes[key];
            } else {
              return _getValue(defaultParams[key]);
            }
          };
          return $scope.getOption = function(key) {
            var _ref;
            if (((_ref = attributes.options) != null ? _ref.key : void 0) != null) {
              return attributes.options[key];
            }
            if (FormForCtrl != null) {
              return FormForCtrl.getOption(key);
            }
            return defaultOptions[key];
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  var app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('metovular.services.cache', []);

  app.factory('CacheService', [
    '$q', 'HttpService', function($q, HttpService) {
      var CacheService;
      return CacheService = (function(_super) {
        __extends(CacheService, _super);

        function CacheService(url, indexRoot, maxAge, useLocalStorage) {
          this.url = url;
          this.indexRoot = indexRoot;
          this.maxAge = maxAge;
          this.useLocalStorage = useLocalStorage;
          CacheService.__super__.constructor.call(this, this.url, this.indexRoot);
          this.maxAge || (this.maxAge = 9000);
          if (!localStorage.getItem(this.url) || !this.useLocalStorage) {
            this.initCache();
          }
          this.loadCache();
          this._deferreds = [];
        }

        CacheService.prototype.initCache = function() {
          this.cache = {
            url: this.url,
            lastUpdated: null,
            items: [],
            cacheVersion: 1
          };
          return this.saveCache();
        };

        CacheService.prototype.loadCache = function() {
          if (!this.useLocalStorage) {
            return;
          }
          return this.cache = JSON.parse(localStorage.getItem(this.url));
        };

        CacheService.prototype.saveCache = function() {
          if (!this.useLocalStorage) {
            return;
          }
          return localStorage.setItem(this.url, JSON.stringify(this.cache));
        };

        CacheService.prototype.all = function(params) {
          var deferred;
          params || (params = {});
          if ((this.cache.lastUpdated != null) && moment().unix() - this.cache.lastUpdated < this.maxAge) {
            return $q.when(this._filterItems(params));
          } else if (this._promise != null) {
            deferred = $q.defer();
            this._deferreds.push(deferred);
            deferred.promise.then((function(_this) {
              return function(items) {
                _this._updateItems(items);
                return _this._filterItems(params);
              };
            })(this));
            return deferred.promise;
          } else {
            return this._promise = CacheService.__super__.all.call(this).then((function(_this) {
              return function(items) {
                _this._promise = null;
                _this._updateItems(items);
                _this._deferreds.forEach(function(d) {
                  return d.resolve(items);
                });
                _this._deferreds.length = 0;
                return _this._filterItems(params);
              };
            })(this), (function(_this) {
              return function(err) {
                _this._deferreds.forEach(function(d) {
                  return d.reject(err);
                });
                _this._deferreds.length = 0;
                return err;
              };
            })(this));
          }
        };

        CacheService.prototype.find = function(id) {
          var item;
          item = _.find(this.cache.items, {
            id: parseInt(id)
          });
          if (item && (this.cache.lastUpdated != null) && moment().unix() - this.cache.lastUpdated < this.maxAge) {
            return $q.when(item);
          } else {
            return CacheService.__super__.find.call(this, id).then((function(_this) {
              return function(data) {
                return _this._updateItem(data);
              };
            })(this));
          }
        };

        CacheService.prototype.create = function(params) {
          return CacheService.__super__.create.call(this, params).then((function(_this) {
            return function(data) {
              return _this._updateItem(data);
            };
          })(this));
        };

        CacheService.prototype.update = function(params) {
          return CacheService.__super__.update.call(this, params).then((function(_this) {
            return function(data) {
              return _this._updateItem(data);
            };
          })(this));
        };

        CacheService.prototype["delete"] = function(params) {
          return CacheService.__super__["delete"].call(this, params).then((function(_this) {
            return function(data) {
              _this._removeItem(data);
              return data;
            };
          })(this));
        };

        CacheService.prototype._filterItems = function(params) {
          return this.cache.items.filter(function(item) {
            return _.keys(params).map(function(key) {
              if (item[key] === params[key]) {
                return 0;
              } else {
                return 1;
              }
            }).reduce((function(a, b) {
              return a + b;
            }), 0) === 0;
          });
        };

        CacheService.prototype._updateItems = function(items) {
          items.forEach((function(_this) {
            return function(item) {
              return _this._updateItem(item);
            };
          })(this));
          this.cache.lastUpdated = moment().unix();
          return this.saveCache();
        };

        CacheService.prototype._updateItem = function(item) {
          var cachedItem;
          cachedItem = _.find(this.cache.items, {
            id: item.id
          });
          if (cachedItem != null) {
            _.extend(cachedItem, item);
            return cachedItem;
          } else {
            return this.cache.items.push(item);
          }
        };

        CacheService.prototype._removeItem = function(item) {
          return _.remove(this.cache.items, {
            id: item.id
          });
        };

        return CacheService;

      })(HttpService);
    }
  ]);

}).call(this);

(function() {
  var app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('metovular.services.http', []);

  app.factory('HttpService', [
    '$resource', 'Model', function($resource, Model) {
      var HttpService;
      return HttpService = (function() {
        function HttpService(url, indexRoot) {
          this.url = url;
          this.indexRoot = indexRoot;
          this._oneToModel = __bind(this._oneToModel, this);
          this._arrayToModel = __bind(this._arrayToModel, this);
          this["delete"] = __bind(this["delete"], this);
          this.service = $resource(this.url, this.defaultParams(), this.actionOptions());
        }

        HttpService.prototype.jsonToModel = function(data) {
          return new Model(data);
        };

        HttpService.prototype.all = function(params) {
          return this.service.query(params).$promise.then((function(_this) {
            return function(data) {
              return _this._arrayToModel(data);
            };
          })(this));
        };

        HttpService.prototype.find = function(id) {
          return this.service.get({
            id: id
          }).$promise.then((function(_this) {
            return function(data) {
              return _this._oneToModel(data);
            };
          })(this));
        };

        HttpService.prototype.create = function(params) {
          return this.service.save(params).$promise.then((function(_this) {
            return function(data) {
              return _this._oneToModel(data);
            };
          })(this));
        };

        HttpService.prototype.update = function(params) {
          return this.service.update(params).$promise.then((function(_this) {
            return function(data) {
              return _this._oneToModel(data);
            };
          })(this));
        };

        HttpService.prototype["delete"] = function(params) {
          return this.service["delete"](params).$promise.then((function(_this) {
            return function(data) {
              return _this._oneToModel(data);
            };
          })(this));
        };

        HttpService.prototype.defaultParams = function() {
          return {
            id: '@id'
          };
        };

        HttpService.prototype.actionOptions = function() {
          return {
            query: {
              method: 'GET',
              isArray: true
            },
            get: {
              method: 'GET'
            },
            save: {
              method: 'POST'
            },
            update: {
              method: 'PUT'
            },
            "delete": {
              method: 'DELETE'
            }
          };
        };

        HttpService.prototype._arrayToModel = function(data) {
          var json, response;
          response = [];
          json = angular.fromJson(data);
          angular.forEach((this.indexRoot != null ? json[this.indexRoot] : json), (function(_this) {
            return function(item) {
              return response.push(_this.jsonToModel(item));
            };
          })(this));
          return response;
        };

        HttpService.prototype._oneToModel = function(data) {
          return this.jsonToModel(angular.fromJson(data));
        };

        return HttpService;

      })();
    }
  ]);

}).call(this);

(function() {
  var app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  app = angular.module('metovular.services.queryCache', []);

  app.factory('QueryCacheService', [
    '$q', 'HttpService', function($q, HttpService) {
      var QueryCacheService;
      return QueryCacheService = (function(_super) {
        __extends(QueryCacheService, _super);

        function QueryCacheService(url, indexRoot, hardDelete) {
          this.url = url;
          this.indexRoot = indexRoot;
          this.hardDelete = hardDelete;
          QueryCacheService.__super__.constructor.call(this, this.url, this.indexRoot);
          this.initCache();
        }

        QueryCacheService.prototype.initCache = function() {
          return this.cache = {
            items: [],
            byQuery: {},
            promises: {}
          };
        };

        QueryCacheService.prototype.all = function(params, force) {
          var queryString;
          params || (params = {});
          queryString = JSON.stringify(params);
          if ((this.cache.byQuery[queryString] != null) && !force) {
            return $q.when(this.cache.byQuery[queryString]);
          } else if ((this.cache.promises[queryString] != null) && !force) {
            return this.cache.promises[queryString];
          } else {
            return this.cache.promises[queryString] = QueryCacheService.__super__.all.call(this, params).then((function(_this) {
              return function(items) {
                var itemIds, _base;
                delete _this.cache.promises[queryString];
                _this._updateItems(items);
                itemIds = items.map(function(i) {
                  return i.id;
                });
                return (_base = _this.cache.byQuery)[queryString] || (_base[queryString] = _this.cache.items.filter(function(item) {
                  var _ref;
                  return _ref = item.id, __indexOf.call(itemIds, _ref) >= 0;
                }));
              };
            })(this), (function(_this) {
              return function(err) {
                return err;
              };
            })(this));
          }
        };

        QueryCacheService.prototype.find = function(id) {
          var item;
          item = _.find(this.cache.items, {
            id: parseInt(id)
          });
          if (item != null) {
            return $q.when(item);
          } else {
            return QueryCacheService.__super__.find.call(this, id).then((function(_this) {
              return function(data) {
                return _this._updateItem(data);
              };
            })(this));
          }
        };

        QueryCacheService.prototype.create = function(params) {
          return QueryCacheService.__super__.create.call(this, params).then((function(_this) {
            return function(data) {
              return _this._updateItem(data);
            };
          })(this));
        };

        QueryCacheService.prototype.update = function(params) {
          return QueryCacheService.__super__.update.call(this, params).then((function(_this) {
            return function(data) {
              return _this._updateItem(data);
            };
          })(this));
        };

        QueryCacheService.prototype["delete"] = function(params) {
          return QueryCacheService.__super__["delete"].call(this, params).then((function(_this) {
            return function(data) {
              if (_this.hardDelete) {
                _.remove(_this.cache.items, params);
                _.keys(_this.cache.byQuery).forEach(function(query) {
                  return _.remove(_this.cache.byQuery[query], params);
                });
              } else {
                _this._updateItem(data);
              }
              return data;
            };
          })(this));
        };

        QueryCacheService.prototype._updateItems = function(items) {
          items.forEach((function(_this) {
            return function(item) {
              return _this._updateItem(item);
            };
          })(this));
          return this.cache.lastUpdated = moment().unix();
        };

        QueryCacheService.prototype._updateItem = function(item) {
          var cachedItem;
          cachedItem = _.find(this.cache.items, {
            id: item.id
          });
          if (cachedItem != null) {
            _.extend(cachedItem, item);
            return cachedItem;
          } else {
            this.cache.items.push(item);
            _.keys(this.cache.byQuery).forEach((function(_this) {
              return function(query) {
                var match;
                match = _this._matchQuery(query, item);
                if (match) {
                  return _this.cache.byQuery[query].push(item);
                }
              };
            })(this));
            return item;
          }
        };

        QueryCacheService.prototype._matchQuery = function(query, item) {
          var params;
          params = JSON.parse(query);
          return _.keys(params).reduce((function(_this) {
            return function(carry, key) {
              var _base;
              return carry && (("" + item[key]) === ("" + params[key]) || (typeof (_base = _this.customMatchers())[key] === "function" ? _base[key](item, params) : void 0));
            };
          })(this), true);
        };

        QueryCacheService.prototype.customMatchers = function() {
          return {};
        };

        return QueryCacheService;

      })(HttpService);
    }
  ]);

}).call(this);

(function() {
  var app;

  app = angular.module('metovular.services', ['metovular.services.cache', 'metovular.services.http', 'metovular.services.queryCache']);

}).call(this);

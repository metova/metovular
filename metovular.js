(function() {
  angular.module('metovular', ['ngResource', 'metovular.model', 'metovular.services']);

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

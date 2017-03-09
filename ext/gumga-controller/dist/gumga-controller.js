(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  'use strict';

  function GumgaController(Service) {
    var self = this;
    this.and = this;
    this.data = [];
    this.pageSize = 10;
    this.count = 0;
    this.records = [];
    this.methods = {
      getRecords: function getRecords() {
        return self.records;
      },
      asyncSearch: function asyncSearch(field, param) {
        return Service.getSearch(field, param).then(function (data) {
          return data.data.values;
        });
      },
      asyncPost: function asyncPost(value, param) {
        self.emit('asyncPostStart');
        return Service.save(value);
      },
      get: function get() {
        var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        self.emit('getStart');
        Service.get(page).then(function (data) {
          self.emit('getSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
          self.data.map(function (record) {
            return self.records.push(record.id);
          });
        }, function (err) {
          self.emit('getError', err);
        });
        return self;
      },
      getId: function getId() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        self.emit('getIdStart');
        Service.getById(id).then(function (data) {
          self.emit('getIdSuccess', data.data);
          self.data = data.data;
          if (self.pageSize) delete self.pageSize;
          if (self.count) delete self.count;
        }, function (err) {
          self.emit('getIdError', err);
        });
        return self;
      },
      getNew: function getNew() {
        self.emit('getNewStart');
        Service.getNew().then(function (data) {
          self.emit('getNewSuccess', data.data);
          self.data = data.data;
          if (self.pageSize) delete self.pageSize;
          if (self.count) delete self.count;
        }, function (err) {
          self.emit('getNewError', err);
        });
        return self;
      },
      put: function put(value) {
        self.emit('putStart');
        Service.update(value).then(function (data) {
          self.emit('putSuccess', data);
        }, function (err) {
          self.emit('putError', err);
        });
        return self;
      },
      post: function post(value) {
        self.emit('postStart');
        Service.save(value).then(function (data) {
          self.emit('postSuccess', data);
        }, function (err) {
          self.emit('postError', err);
        });
        return self;
      },
      delete: function _delete(array) {
        self.emit('deleteStart');
        Service.deleteCollection(array).then(function (data) {
          self.emit('deleteSuccess', data);
        }, function (err) {
          self.emit('deleteError', err);
        });
        return self;
      },
      sort: function sort(field, way) {
        self.emit('sortStart');
        Service.sort(field, way).then(function (data) {
          self.emit('sortSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('sortError', err);
        });
        return self;
      },
      search: function search(field, param) {
        self.emit('searchStart');
        Service.getSearch(field, param).then(function (data) {
          self.emit('searchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('searchError', err);
        });
        return self;
      },
      advancedSearch: function advancedSearch(param) {
        self.emit('advancedSearchStart');
        Service.getAdvancedSearch(param).then(function (data) {
          self.emit('advancedSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('advancedSearchError', err);
        });
        return self;
      },
      redoSearch: function redoSearch() {
        self.emit('redoSearchStart');
        Service.redoSearch().then(function (data) {
          self.emit('redoSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('redoSearchError', err);
        });
        return self;
      },
      postQuery: function postQuery(query, name) {
        self.emit('postQueryStart');
        Service.saveQuery({ query: query, name: name }).then(function (data) {
          self.emit('postQuerySuccess');
        }, function (err) {
          self.emit('postQueryError', err);
        });
        return self;
      },
      getQuery: function getQuery(page) {
        self.emit('getQueryStart');
        return Service.getQuery(page).then(function (data) {
          self.emit('getQuerySuccess', data.data);
          return data.data.values;
        }, function (err) {
          self.emit('getQueryError', err);
        });
      },
      postImage: function postImage(attribute, model) {
        self.emit('postImageStart');
        return Service.saveImage(attribute, model).then(function (data) {
          self.emit('postImageSuccess');
          return data;
        }, function (err) {
          self.emit('postImageError', err);
        });
      },
      deleteImage: function deleteImage(attribute, model) {
        self.emit('deleteImageStart');
        Service.deleteImage(attribute, model).then(function (data) {
          self.emit('deleteImageSuccess');
        }, function (err) {
          self.emit('deleteImageError', err);
        });
        return self;
      },
      reset: function reset() {
        self.emit('resetStart');
        Service.resetDefaultState();
        return self;
      },
      getAvailableTags: function getAvailableTags() {
        self.emit('getAvailableTagsStart');
        return Service.getAvailableTags();
      },
      getSelectedTags: function getSelectedTags(id) {
        self.emit('getSelectedTagsStart');
        return Service.getSelectedTags(id);
      },
      postTags: function postTags(id, values) {
        self.emit('postTagStart', values);
        Service.postTags(id, values).then(function (data) {
          self.emit('postTagSuccess', values);
        }, function (err) {
          self.emit('postTagError', values);
        });
      },
      getDocumentationURL: function getDocumentationURL() {
        self.emit('getDocumentationURLStart');
        return Service.getDocumentationURL();
      }
    };
  }

  GumgaController.prototype.callbacks = {};

  GumgaController.prototype.and = this;

  GumgaController.prototype.emit = function (ev, data) {
    if (this.callbacks[ev]) {
      this.callbacks[ev].forEach(function (cb) {
        cb(data);
      });
    }
    return this;
  };

  GumgaController.prototype.on = function (ev, cb) {
    if (!this.callbacks[ev]) {
      this.callbacks[ev] = [];
    }
    this.callbacks[ev].push(cb);
    return this;
  };

  GumgaController.prototype.execute = function () {
    var nameOfTheFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (nameOfTheFunction.constructor !== String) throw 'O primeiro parâmetro deve ser uma string!';
    if (this.methods[nameOfTheFunction]) {
      var _methods;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_methods = this.methods)[nameOfTheFunction].apply(_methods, args);
      return this;
    }
    throw 'O nome do método está errado! Por favor coloque um método que está no GumgaController';
  };

  // -------------------------------------------------------- Componente

  GumgaCtrl.$inject = [];

  function GumgaCtrl() {

    function createRestMethods(container, service, identifierOrConfiguration) {
      var idConstructor = identifierOrConfiguration.constructor;
      if (!container) throw 'É necessário passar um objeto no primeiro parâmetro';
      if (!service) throw 'É necessário passar um objeto no segundo parâmetro';
      if (idConstructor !== Object && idConstructor !== String) throw 'É necessário passar um objeto ou uma string no terceiro parâmetro';
      var options = this._createOptions(identifierOrConfiguration);
      if (!!options.noScope) return new GumgaController(service);
      container[options.identifier] = new GumgaController(service);
      return;
    }

    function _createOptions() {
      var identifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (identifier.constructor === String) {
        return {
          identifier: identifier,
          noScope: false
        };
      }
      var object = angular.extend({}, identifier);
      object.noScope = !!object.noScope;
      if (!object.identifier) {
        throw 'Você precisa passar um identificador para o objeto de configuração do createRestMethods!';
      }
      return object;
    }

    return {
      createRestMethods: createRestMethods,
      _createOptions: _createOptions
    };
  }

  angular.module('gumga.controller', []).factory('gumgaController', GumgaCtrl);
})();

},{}]},{},[1]);

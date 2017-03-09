(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

ListCreator.$inject = [];
//TODO: Otimizar estas funções de criação de HTML.
function ListCreator() {
  var itemsPerPage = '\n      <div class="row">\n        <div class="col-md-offset-9 col-md-2">\n          <div class="text-right" style="line-height: 30px">\n            <span gumga-translate-tag="gumgalist.itemsperpage"></span>\n          </div>\n        </div>\n        <div class="col-md-1">\n          <select class="form-control input-sm" ng-options="item for item in ctrl.config.itemsPerPage" ng-model="ctrl.selectedItemPerPage">\n          </select>\n        </div>\n      </div>';

  function formatTableHeader(sortField, title) {
    var templateWithSort = '\n        <a ng-click="ctrl.doSort(\'' + sortField + '\')" class="th-sort">\n          ' + title + '\n          <span ng-show="ctrl.activeSorted.column  == \'' + sortField + '\'" ng-class="ctrl.activeSorted.direction == \'asc\' ? \'dropup\' : \' \' ">\n            <span class="caret"></span>\n          </span>\n        </a>';
    return !!sortField ? templateWithSort : title;
  }

  function generateHeader(config) {
    if (config.headers) {
      return '\n          <thead>\n            <tr>\n              ' + generateHeaderColumns(config.columnsConfig) + '\n            </tr>\n          </thead>\n        ';
    } else {
      return '';
    }
  }

  function generateHeaderColumns() {
    var columnsArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var hasCheckbox = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return columnsArray.reduce(function (prev, next) {
      return prev += '\n          <th style="' + (next.style || ' ') + '" class="' + (next.size || ' ') + '">\n            <strong>\n              ' + formatTableHeader(next.sortField, next.title) + '\n            </strong>\n          </th>';
    }, ' ');
  }

  function generateBody(columnsArray) {
    return columnsArray.reduce(function (prev, next) {
      return prev += '\n          <td class="' + next.size + '" ng-style="{\'border-left\': {{ ctrl.conditionalTableCell($value,\'' + next.name + '\') }} }"> ' + next.content + '</td>';
    }, ' ');
  }

  function mountTable(config, className) {
    if (config.checkbox) {
      config.columnsConfig.unshift({
        title: '<input type="checkbox" ng-model="ctrl.checkAll" ng-change="ctrl.selectAll(ctrl.checkAll)" ng-if="\'' + config.selection + '\' === \'multi\'"/>',
        name: '$checkbox',
        content: '<input name="$checkbox" type="checkbox" ng-model="ctrl.selectedMap[$index].checkbox"/>',
        size: 'col-md-1',
        conditional: angular.noop
      });
    }
    return '\n        ' + (config.itemsPerPage.length > 0 ? itemsPerPage : ' ') + '\n        <div class="table-responsive">\n          <table class="' + className + '">\n            <thead>\n              <tr>\n                ' + generateHeader(config) + '\n              </tr>\n            </thead>\n            <tbody>\n            <tr ng-style="{ \'border-left\': {{ ctrl.conditional($value) }} }" ng-dblclick="ctrl.doubleClick($value)" ng-class="ctrl.selectedMap[$index].checkbox ? \'active active-list\' : \'\'"\n                ng-repeat="$value in ctrl.data track by $index" ng-click="ctrl.select($index,$event)">\n                ' + generateBody(config.columnsConfig) + '\n              </tr>\n            </tbody>\n          </table>\n        </div>';
  }

  return { mountTable: mountTable };
}

angular.module('gumga.list.creator', []).factory('listCreator', ListCreator);

},{}],2:[function(require,module,exports){
'use strict';

require('./list-creator.factory.js');

List.$inject = ['$compile', 'listCreator'];

function List($compile, listCreator) {

  controller.$inject = ['$scope', '$element', '$attrs'];

  function controller($scope, $element, $attrs) {
    var ctrl = this;

    var errorMessages = {
      noData: 'O componente gumgaList necessita de um atributo data, que irá conter os dados que serão visualizados.',
      noConfig: 'O componente gumgaList necessita de um atributo config, que irá conter a configuração necessária.',
      noColumns: 'O componente gumgaList necessita que, no objeto de configuração, exista um atributo columns.'
    };

    var hasAttr = function hasAttr(string) {
      return !!$attrs[string];
    },
        hasConfig = function hasConfig(string) {
      return !!(ctrl.config && ctrl.config[string]);
    },
        defaultHeaders = true,
        defaultCssClass = 'table ',
        defaultSelection = 'single',
        defaultItemsPerPage = [],
        defaultSortedColumn = null;

    function guaranteeColumns() {
      var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';
      var columnsConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return columns.split(',').map(function (rawColumn) {
        var column = rawColumn.trim(),
            configuration = columnsConfig.filter(function (value) {
          return value.name == column;
        })[0] || { name: column },
            title = configuration.title || column.charAt(0).toUpperCase() + column.slice(1),
            size = configuration.size || ' ',
            name = configuration.name || column,
            content = configuration.content || '{{$value.' + column + '}}',
            sortField = configuration.sortField || null,
            conditional = configuration.conditional || angular.noop;
        return { title: title, size: size, name: name, content: content, sortField: sortField, conditional: conditional };
      });
    }

    // Garantindo que existam todos os atributos que podem ser passados via elemento.
    ctrl.data = ctrl.data || [];
    ctrl.config = ctrl.config || {};
    ctrl.sort = hasAttr('sort') ? ctrl.sort : angular.noop;
    ctrl.class = hasAttr('class') ? defaultCssClass.concat($attrs.class || ' ') : defaultCssClass;
    ctrl.onClick = hasAttr('onClick') ? ctrl.onClick : angular.noop;
    ctrl.onDoubleClick = hasAttr('onDoubleClick') ? ctrl.onDoubleClick : angular.noop;
    ctrl.onSort = hasAttr('onSort') ? ctrl.onSort : angular.noop;
    ctrl.changePerPage = hasAttr('changePerPage') ? ctrl.changePerPage : angular.noop;

    // Garantindo que existam todas as configurações necessárias no objeto.
    function guaranteeConfig() {
      ctrl.config.headers = ctrl.config.hasOwnProperty('headers') ? !!ctrl.config.headers : defaultHeaders;
      ctrl.config.checkbox = !!ctrl.config.checkbox;
      ctrl.config.selection = hasConfig('selection') ? ctrl.config.selection : defaultSelection;
      ctrl.config.itemsPerPage = hasConfig('itemsPerPage') ? ctrl.config.itemsPerPage : defaultItemsPerPage;
      ctrl.config.sortDefault = hasConfig('sortDefault') ? ctrl.config.sortDefault : defaultSortedColumn;
      ctrl.config.conditional = hasConfig('conditional') ? ctrl.config.conditional : angular.noop;
      ctrl.config.columnsConfig = guaranteeColumns(ctrl.config.columns, ctrl.config.columnsConfig);
    }

    // Tratamento de erros do componente.
    if (!hasAttr('data')) console.error(errorMessages.noData);
    if (!hasAttr('configuration')) console.error(errorMessages.noConfig);
    if (!hasConfig('columns')) console.error(errorMessages.noColumns);
    // Variáveis e funções utilizadas pelo componente durante tempo de execução.
    ctrl.selectedValues = [];
    ctrl.selectedMap = {};
    ctrl.activeSorted = { column: null, direction: null };

    ctrl.conditional = conditional;
    ctrl.conditionalTableCell = conditionalTableCell;

    ctrl.doSort = doSort;
    ctrl.doubleClick = doubleClick;
    ctrl.select = select;
    ctrl.selectAll = selectAll;

    if (ctrl.config.sortDefault != null) ctrl.doSort(ctrl.config.sortDefault);

    $scope.$parent.selectedValues = ctrl.selectedValues;

    $scope.$watch('ctrl.config', function () {
      guaranteeConfig();
      compileElement();
    });

    $scope.$watch('ctrl.data', function () {
      return updateMap(ctrl.data);
    }, true);

    $scope.$watch('ctrl.selectedValues', function () {
      var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var oldVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return updateSelected(newVal, newVal.length - oldVal.length >= 0, oldVal);
    }, true);

    $scope.$watch('ctrl.selectedItemPerPage', function (newVal, oldVal) {
      return changePerPage(newVal);
    }, true);

    function findEqualInMap() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var auxObj = ctrl.selectedMap;
      for (var key in auxObj) {
        if (auxObj.hasOwnProperty(key) && angular.equals(obj, auxObj[key].value)) return auxObj[key];
      }return false;
    }

    function findEqualInSelected() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return ctrl.selectedValues.filter(function (val) {
        return angular.equals(obj.value, val);
      }).length == 0;
    }

    function updateMap() {
      var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      ctrl.selectedMap = {};
      newVal.forEach(function (value, index) {
        return ctrl.selectedMap[index] = { checkbox: false, value: value };
      });
      updateSelectedValues();
    }

    function updateSelected(selectedValues, wasAdded, oldSelectedValues) {
      if (selectedValues.length > 1 && ctrl.config.selection == 'single') {
        selectedValues = selectedValues.filter(function (value) {
          return !angular.equals(oldSelectedValues[0], value);
        });
        uncheckSelectedMap();
      }
      if (wasAdded) {
        selectedValues.forEach(function (val) {
          var mapObject = findEqualInMap(val);
          if (mapObject && !mapObject.checkbox) mapObject.checkbox = true;
        });
      } else {
        Object.keys(ctrl.selectedMap).forEach(function (value) {
          if (ctrl.selectedMap[value].checkbox && findEqualInSelected(ctrl.selectedMap[value])) ctrl.selectedMap[value].checkbox = false;
        });
      }
      updateSelectedValues();
    }

    function updateSelectedValues() {
      var selected = Object.keys(ctrl.selectedMap).filter(function (val) {
        return ctrl.selectedMap[val].checkbox;
      }).map(function (val) {
        return ctrl.selectedMap[val].value;
      });
      if (!$attrs.selectedValues) {
        $scope.$parent.selectedValues = selected;
      }
      ctrl.selectedValues = selected;
    }

    function uncheckSelectedMap() {
      Object.keys(ctrl.selectedMap).forEach(function (value) {
        if (ctrl.selectedMap[value].checkbox) ctrl.selectedMap[value].checkbox = !ctrl.selectedMap[value].checkbox;
      });
    }

    function conditional(value) {
      var obj = ctrl.config.conditional(value);
      var trueValue = void 0,
          falseValue = void 0;
      for (var key in obj) {
        obj[key] === true ? trueValue = key : falseValue = key;
      }

      if (trueValue) return '\"'.concat(trueValue).concat('\"');
      return '\'\'';
    }

    function conditionalTableCell(value, ordering) {
      var columnToGetTheConditional = ctrl.config.columnsConfig.filter(function (val) {
        return val.name == ordering;
      })[0];

      if (columnToGetTheConditional) {
        var obj = columnToGetTheConditional.conditional(value),
            trueValue = void 0,
            falseValue = void 0;

        for (var key in obj) {
          if (obj[key] === true) {
            trueValue = key;
          } else {
            falseValue = key;
          }
        }
        return '\"'.concat(trueValue).concat('\"');
      }
      return '\'\'';
    }

    function doSort(sortField) {
      ctrl.activeSorted.column = sortField;
      ctrl.activeSorted.direction = ctrl.activeSorted.direction == 'asc' ? 'desc' : 'asc';
      ctrl.sort({ field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
      ctrl.onSort({ field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
    }

    function doubleClick($value) {
      ctrl.onDoubleClick({ $value: $value });
    }

    function changePerPage(value) {
      ctrl.changePerPage({ value: value });
    }

    function select(index) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { target: {} };

      if (ctrl.config.selection != 'none') {
        if (event.target.name == '$checkbox' && ctrl.config.selection == 'single') uncheckSelectedMap();
        if (event.target.name == '$checkbox' && ctrl.config.selection == 'multi') ctrl.selectedMap[index].checkbox = !ctrl.selectedMap[index].checkbox;
        if (ctrl.checkAll) ctrl.checkAll = false;
        if (ctrl.config.selection == 'single' && !ctrl.selectedMap[index].checkbox) uncheckSelectedMap();
        ctrl.selectedMap[index].checkbox = !ctrl.selectedMap[index].checkbox;
        updateSelectedValues();
        ctrl.onClick({ $value: ctrl.selectedMap[index].value });
      }
    }

    function selectAll(boolean) {
      Object.keys(ctrl.selectedMap).forEach(function (value) {
        return ctrl.selectedMap[value].checkbox = boolean;
      });
      updateSelectedValues();
    }

    // Compilação do componente na tela.
    function compileElement() {
      $element.html('');
      var element = angular.element(listCreator.mountTable(ctrl.config, ctrl.class));
      $element.append($compile(element)($scope));
    }
    try {
      compileElement();
    } catch (err) {}
  }

  return {
    restrict: 'E',
    scope: {
      'sort': '&?',
      'data': '=',
      'selectedValues': '=?',
      'onClick': '&?',
      'onDoubleClick': '&?',
      'onSort': '&?',
      'config': '=configuration',
      'changePerPage': '&?'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: controller
  };
}

angular.module('gumga.list', ['gumga.list.creator']).directive('gumgaList', List);

},{"./list-creator.factory.js":1}]},{},[2]);
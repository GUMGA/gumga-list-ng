(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {

    function scanTable($table) {
        var m = [];
        $table.children("tr").each(function (y, row) {
            angular.element(row).children("td, th").each(function (x, cell) {
                var $cell = angular.element(cell),
                    cspan = $cell.attr("colspan") | 0,
                    rspan = $cell.attr("rowspan") | 0,
                    tx,
                    ty;
                cspan = cspan ? cspan : 1;
                rspan = rspan ? rspan : 1;
                for (; m[y] && m[y][x]; ++x) {} //skip already occupied cells in current row
                for (tx = x; tx < x + cspan; ++tx) {
                    //mark matrix elements occupied by current cell with true
                    for (ty = y; ty < y + rspan; ++ty) {
                        if (!m[ty]) {
                            //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }
                var pos = { top: y, left: x };
                $cell.data("cellPos", pos);
            });
        });
    };

    angular.element.fn.cellPos = function (rescan) {
        var $cell = this.first(),
            pos = $cell.data("cellPos");
        if (!pos || rescan) {
            var $table = $cell.closest("table, thead, tbody, tfoot");
            scanTable($table);
        }
        pos = $cell.data("cellPos");
        return pos;
    };

    angular.element.fn.smartGrid = function (param) {
        return this.each(function () {
            SmartGrid.call(this);
        });

        function SmartGrid() {

            {
                var setCorner = function setCorner() {
                    var table = angular.element(settings.table);

                    if (settings.head) {
                        if (settings.left > 0) {
                            var tr = table.find("thead tr");

                            tr.each(function (k, row) {
                                solverLeftColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index'] + 1);
                                });
                            });
                        }

                        if (settings.right > 0) {
                            var tr = table.find("thead tr");

                            tr.each(function (k, row) {
                                solveRightColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index'] + 1);
                                });
                            });
                        }
                    }

                    if (settings.foot) {
                        if (settings.left > 0) {
                            var tr = table.find("tfoot tr");

                            tr.each(function (k, row) {
                                solverLeftColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index']);
                                });
                            });
                        }

                        if (settings.right > 0) {
                            var tr = table.find("tfoot tr");

                            tr.each(function (k, row) {
                                solveRightColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index']);
                                });
                            });
                        }
                    }
                };

                var setParent = function setParent() {
                    var parent = angular.element(settings.parent);
                    var table = angular.element(settings.table);
                    // parent.append(table);
                    parent.css({
                        'overflow-x': 'auto',
                        'overflow-y': 'auto'
                    });

                    parent.scroll(function () {
                        var scrollWidth = parent[0].scrollWidth;
                        var clientWidth = parent[0].clientWidth;
                        var scrollHeight = parent[0].scrollHeight;
                        var clientHeight = parent[0].clientHeight;
                        var top = parent.scrollTop();
                        var left = parent.scrollLeft();

                        if (settings.head) parent.find("thead tr > *").css("top", top);

                        if (settings.foot) parent.find("tfoot tr > *").css("bottom", scrollHeight - clientHeight - top);

                        if (settings.left > 0) {
                            settings.leftColumns.css("left", left);
                            if (settings.class) settings.leftColumns.addClass(settings.class);
                        }

                        if (settings.right > 0) {
                            settings.rightColumns.css("right", scrollWidth - clientWidth - left);
                            if (settings.class) settings.rightColumns.addClass(settings.class);
                        }
                    });
                };

                // Set table head fixed


                var fixHead = function fixHead() {
                    var thead = angular.element(settings.table).find("thead");
                    var tr = thead.find("tr");
                    var cells = thead.find("tr > *");
                    setBackground(cells);
                    cells.css({
                        'position': 'relative'
                    });
                };

                // Set table foot fixed


                var fixFoot = function fixFoot() {
                    var tfoot = angular.element(settings.table).find("tfoot");
                    var tr = tfoot.find("tr");
                    var cells = tfoot.find("tr > *");

                    setBackground(cells);
                    cells.css({
                        'position': 'relative'
                    });
                };

                // Set table left column fixed


                var fixLeft = function fixLeft() {
                    var table = angular.element(settings.table);
                    settings.leftColumns = angular.element();
                    var tr = table.find("tr"),
                        count = 0;
                    tr.each(function (k, row) {
                        solverLeftColspan(row, function (cell) {
                            if (settings.top == undefined || count < settings.top * settings.left) settings.leftColumns = settings.leftColumns.add(cell);
                            if (cell[0] && cell[0].nodeName == 'TD') count++;
                        });
                    });
                    var column = settings.leftColumns;
                    column.each(function (k, cell) {
                        var cell = angular.element(cell);
                        setBackground(cell);
                        cell.css({
                            'position': 'relative'
                        });
                    });
                };

                // Set table right column fixed


                var fixRight = function fixRight() {
                    var table = angular.element(settings.table);

                    var fixColumn = settings.right;

                    settings.rightColumns = angular.element();

                    var tr = table.find("tr");
                    tr.each(function (k, row) {
                        solveRightColspan(row, function (cell) {
                            settings.rightColumns = settings.rightColumns.add(cell);
                        });
                    });

                    var column = settings.rightColumns;

                    column.each(function (k, cell) {
                        var cell = angular.element(cell);

                        setBackground(cell);
                        cell.css({
                            'position': 'relative'
                        });
                    });
                };

                // Set fixed cells backgrounds


                var setBackground = function setBackground(elements) {
                    elements.each(function (k, element) {
                        var element = angular.element(element);
                        var parent = angular.element(element).parent();

                        var elementBackground = element.css("background-color");
                        elementBackground = elementBackground == "transparent" || elementBackground == "rgba(0, 0, 0, 0)" ? null : elementBackground;

                        var parentBackground = parent.css("background-color");
                        parentBackground = parentBackground == "transparent" || parentBackground == "rgba(0, 0, 0, 0)" ? null : parentBackground;

                        var background = parentBackground ? parentBackground : "white";
                        background = elementBackground ? elementBackground : background;
                        // element.css("background-color", background);
                        element.css("background-color", "white");
                    });
                };

                var solverLeftColspan = function solverLeftColspan(row, action) {
                    var fixColumn = settings.left;
                    var inc = 1;

                    for (var i = 1; i <= fixColumn; i = i + inc) {
                        var nth = inc > 1 ? i - 1 : i;

                        var cell = angular.element(row).find("> *:nth-child(" + nth + ")");
                        var colspan = cell.prop("colspan");

                        if (cell.cellPos().left < fixColumn) {
                            action(cell);
                        }

                        inc = colspan;
                    }
                };

                var solveRightColspan = function solveRightColspan(row, action) {
                    var fixColumn = settings.right;
                    var inc = 1;

                    for (var i = 1; i <= fixColumn; i = i + inc) {
                        var nth = inc > 1 ? i - 1 : i;

                        var cell = angular.element(row).find("> *:nth-last-child(" + nth + ")");
                        var colspan = cell.prop("colspan");

                        action(cell);

                        inc = colspan;
                    }
                };

                var defaults = {
                    head: true,
                    foot: false,
                    left: 0,
                    right: 0,
                    class: 'smart-grid-fixed',
                    'z-index': 0
                };

                var settings = angular.element.extend({}, defaults, param);

                settings.table = this;
                settings.parent = $(settings.table).parent();
                setParent();

                if (settings.head == true) fixHead();

                if (settings.foot == true) fixFoot();

                if (settings.left > 0) fixLeft();

                if (settings.right > 0) fixRight();

                setCorner();

                angular.element(settings.parent).trigger("scroll");

                window.onresize = function () {
                    return angular.element(settings.parent).trigger("scroll");
                };
            }
        }
    };
})();

},{}],2:[function(require,module,exports){
'use strict';

ListCreator.$inject = [];
//TODO: Otimizar estas funções de criação de HTML.
function ListCreator() {
  var itemsPerPage = '\n      <div class="row">\n        <div class="col-md-offset-9 col-md-2">\n          <div class="text-right" style="line-height: 30px">\n            <span gumga-translate-tag="gumgalist.itemsperpage"></span>\n          </div>\n        </div>\n        <div class="col-md-1">\n          <select class="form-control input-sm" ng-options="item for item in ctrl.listConfig.itemsPerPage" ng-model="ctrl.selectedItemPerPage">\n          </select>\n        </div>\n      </div>';

  var paginationTemplate = '\n        <div class="page-select">\n          <div class="btn-group smart-footer-item">\n            <button type="button"\n                    class="btn btn-default dropdown-toggle"\n                    data-toggle="dropdown"\n                    aria-haspopup="true"\n                    aria-expanded="false">\n              P\xE1gina: &nbsp; {{ctrl.pageModel}} &nbsp; <span class="caret"></span>\n            </button>\n            <ul class="gmd dropdown-menu">\n              <li class="search">\n                <input type="number" min="1" step="1" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" autofocus max="{{ctrl.getTotalPage()[ctrl.getTotalPage().length - 1]}}" placeholder="P\xE1gina" class="form-control" ng-keypress="ctrl.inputPageChange($event)"/>\n              </li>\n              <li class="effect-ripple {{page == ctrl.pageModel ? \'selected\' : \'\'}}" ng-click="ctrl.changePage(page)" ng-repeat="page in ctrl.getTotalPage()">\n                {{page}}\n              </li>\n            </ul>\n          </div>\n        </div>\n\n        <div class="page-select" ng-show="ctrl.listConfig.itemsPerPage.length > 0">\n          <div class="btn-group smart-footer-item">\n            <button type="button"\n                    class="btn btn-default dropdown-toggle"\n                    data-toggle="dropdown"\n                    aria-haspopup="true"\n                    aria-expanded="false">\n              Itens por p\xE1gina: &nbsp; {{ctrl.pageSize}} &nbsp; <span class="caret"></span>\n            </button>\n            <ul class="gmd dropdown-menu">\n              <li class="effect-ripple {{itemPerPage == ctrl.pageSize ? \'selected\' : \'\'}}"\n                  ng-click="ctrl.changePage(page, itemPerPage)" ng-repeat="itemPerPage in ctrl.listConfig.itemsPerPage">\n                {{itemPerPage}}\n              </li>\n            </ul>\n          </div>\n        </div>\n\n        <div class="page-select">\n          <div class="smart-footer-item">\n            {{ 1+ (ctrl.pageModel-1) * ctrl.pageSize}} - {{ctrl.roundNumber(ctrl.count, ctrl.pageSize, ctrl.pageModel)}} de {{ctrl.count}}\n            <button class="btn" type="button" ng-disabled="!ctrl.existsPreviousPage()" ng-click="ctrl.previousPage()"><i class="glyphicon glyphicon-chevron-left"></i></button>\n            <button class="btn" type="button" ng-disabled="!ctrl.existsNextPage()" ng-click="ctrl.nextPage()"><i class="glyphicon glyphicon-chevron-right"></i></button>\n          </div>\n        </div>\n  ';

  function formatTableHeader(sortField, title) {
    var templateWithSort = '\n        <a ng-click="ctrl.doSort(\'' + sortField + '\')" class="th-sort">\n          ' + title + '\n          <span style="{{ctrl.activeSorted.column  == \'' + sortField + '\' ? \'\': \'opacity: 0.4;\'}}" ng-class="ctrl.activeSorted.direction == \'asc\' ? \'dropup\' : \' \' ">\n            <span class="caret"></span>\n          </span>\n        </a>';
    return !!sortField ? templateWithSort : title;
  }

  function generateHeader(config) {
    if (config.headers) {
      return '\n              ' + generateHeaderColumns(config.columnsConfig) + '\n        ';
    } else {
      return '';
    }
  }

  function generateHeaderColumns() {
    var columnsArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var hasCheckbox = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return columnsArray.reduce(function (prev, next) {
      return prev += '\n          <th style="' + (next.style || ' ') + ' white-space: nowrap; {{ctrl.listConfig.fixed && ctrl.listConfig.fixed.left ? \'\' : \'z-index: 1;\'}}" class="' + (next.size || ' ') + '">\n            <strong>\n              ' + formatTableHeader(next.sortField, next.title) + '\n            </strong>\n          </th>';
    }, ' ');
  }

  function generateBody(columnsArray) {
    return columnsArray.reduce(function (prev, next) {
      if (next.name == "$checkbox") {
        return prev += '\n            <td class="' + next.size + ' td-checkbox" ng-style="{\'border-left\': {{ ctrl.conditionalTableCell($value,\'' + next.name + '\') }} }"> ' + next.content + '</td>';
      }
      return prev += '\n          <td class="' + next.size + '" ng-style="{\'border-left\': {{ ctrl.conditionalTableCell($value,\'' + next.name + '\') }} }"> ' + next.content + '</td>';
    }, ' ');
  }

  function mountTable(config, className, style) {
    if (config.checkbox) {
      config.columnsConfig.unshift({
        title: '<div class="pure-checkbox">\n                  <input type="checkbox"\n                         ng-model="ctrl.checkAll"\n                         ng-change="ctrl.selectAll(ctrl.checkAll)"\n                         ng-show="\'' + config.selection + '\' === \'multi\'"/>\n                         <label ng-click="ctrl.checkAll = !ctrl.checkAll; ctrl.selectAll(ctrl.checkAll)"></label>\n                </div>',
        name: '$checkbox',
        content: '<div class="pure-checkbox">\n                    <input  name="$checkbox"\n                            type="checkbox"\n                            ng-model="ctrl.selectedMap[$index].checkbox"/>\n                            <label></label>\n                  </div>',
        size: 'col-md-1',
        conditional: angular.noop
      });
    }
    return '\n        ' + (config.itemsPerPage.length > 0 && !config.materialTheme ? itemsPerPage : ' ') + '\n        <style ng-if="ctrl.listConfig.materialTheme">' + style + '</style>\n        <div class="{{ctrl.listConfig.materialTheme ? \'gmd panel\': \'\'}}">\n          <div ng-show="(ctrl.listConfig.materialTheme && (ctrl.listConfig.actions.length > 0 || ctrl.listConfig.title))"\n               class="{{ctrl.listConfig.materialTheme ? \'panel-actions\': \'\'}}">\n              <h4 ng-show="ctrl.listConfig.title">{{ctrl.listConfig.title}}</h4>\n              <div class="actions">\n                <div  ng-repeat="action in ctrl.listConfig.actions"\n                      ng-click="action.onClick(ctrl.selectedValues, ctrl.data)"\n                      style="float: left;padding-left: 15px;"\n                      class="{{ctrl.selectedValues.length > 0 ? action.classOnSelectedValues : action.classOnNotSelectedValues}}"\n                      ng-bind-html="ctrl.trustAsHtml(action.icon)"></div>\n              </div>\n          </div>\n          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == \'TOP\' || ctrl.pagePosition.toUpperCase() == \'ALL\')"\n               class="{{ctrl.listConfig.materialTheme ? \'panel-heading\': \'\'}}"\n               style="justify-content: {{ctrl.pageAlign}};">\n              ' + paginationTemplate + '\n          </div>\n          <div class="{{ctrl.listConfig.materialTheme ? \'panel-body\': \'\'}}" style="padding: 0;">\n            <div class="table-responsive" style="{{ctrl.maxHeight ? \'max-height: \'+ctrl.maxHeight : \'\'}}">\n              <table class="' + className + '">\n                <thead>\n                  <tr>\n                    ' + generateHeader(config) + '\n                  </tr>\n                </thead>\n                <tbody>\n                <tr ng-style="{ \'border-left\': {{ ctrl.conditional($value) }} }"\n                    ng-dblclick="ctrl.doubleClick($value)"\n                    ng-class="ctrl.selectedMap[$index].checkbox ? \'active active-list\' : \'\'"\n                    ng-repeat="$value in ctrl.data track by $index" ng-click="ctrl.select($index,$event)">\n                    ' + generateBody(config.columnsConfig) + '\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == \'BOTTOM\' || ctrl.pagePosition.toUpperCase() == \'ALL\')"\n               class="{{ctrl.listConfig.materialTheme ? \'panel-footer\': \'\'}}"\n               style="justify-content: {{ctrl.pageAlign}};">\n              ' + paginationTemplate + '\n          </div>\n        </div>\n        ';
  }

  return { mountTable: mountTable };
}

angular.module('gumga.list.creator', []).factory('listCreator', ListCreator);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n\ngumga-list .table{\n  margin: 0;\n}\n\ngumga-list tr{\n  transition: background-color .2s;\n  height: 48px !important;\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\n}\n\ngumga-list tr th a:hover{\n  color: #525252;\n  text-decoration: none;\n  cursor: pointer;\n}\n\ngumga-list .panel-footer, gumga-list .panel-heading{\n  padding: 10px;\n  text-align: right;\n  background-color: #fff;\n  border-top: 0;\n}\n\ngumga-list .panel-actions{\n  border-bottom: 1px solid transparent;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n  flex-wrap: wrap-reverse;\n  box-sizing: border-box;\n  font-size: 12px;\n  color: rgba(0,0,0,.54);\n  border-top: 1px rgba(0,0,0,.12) solid !important;\n  background-color: #fff;\n  padding: 10px 24px;\n  display: flex;\n}\n\ngumga-list .panel-actions .actions{\n  margin-left: auto;\n  padding-top: 10px;\n}\n\ngumga-list .panel-actions .actions i {\n  font-size: 20px;\n  cursor: pointer;\n}\n\ngumga-list .table>thead>tr>th{\n  border: none !important;\n  vertical-align: initial !important;\n}\n\n/**\n  START PERSONALIZE ROWS\n**/\ngumga-list .table>tbody>tr:hover .smart-grid-fixed, gumga-list .table>tbody>tr:hover{\n  -webkit-transition: background-color 300ms linear;\n  -ms-transition: background-color 300ms linear;\n  transition: background-color 300ms linear;\n  background: #f5f5f5 !important;\n}\n\ngumga-list .active-list .smart-grid-fixed {\n  background: #f5f5f5 !important;\n}\n\n/**\n  END PERSONALIZE ROWS\n**/\n\n.effect-ripple {\n  position: relative;\n  overflow: hidden;\n  transform: translate3d(0, 0, 0);\n}\n.effect-ripple:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);\n  background-repeat: no-repeat;\n  background-position: 50%;\n  transform: scale(10, 10);\n  opacity: 0;\n  transition: transform .5s, opacity 1s;\n}\n.effect-ripple:active:after {\n  transform: scale(0, 0);\n  opacity: .2;\n  transition: 0s;\n}\n\ngumga-list .panel .panel-body{\n  margin: 0 !important;\n}\n\ngumga-list .table>tbody>tr.active>td, .table>tbody>tr.active>th, .table>tbody>tr>td.active, .table>tbody>tr>th.active, .table>tfoot>tr.active>td, .table>tfoot>tr.active>th, .table>tfoot>tr>td.active, .table>tfoot>tr>th.active, .table>thead>tr.active>td, .table>thead>tr.active>th, .table>thead>tr>td.active, .table>thead>tr>th.active{\n  background: #f5f5f5 !important;\n}\n\ngumga-list .smart-footer-item button{\n  border: none !important;\n  outline: none !important;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  font-size: 13px;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n\ngumga-list .smart-footer-item > button:hover, gumga-list .smart-footer-item > button:active{\n  background: #fff;\n  outline: none !important;\n  color: #000000;\n}\n\ngumga-list .btn-default.active.focus, .btn-default.active:focus, .btn-default.active:hover, .btn-default:active.focus, .btn-default:active:focus, .btn-default:active:hover, .open>.dropdown-toggle.btn-default.focus, .open>.dropdown-toggle.btn-default:focus, .open>.dropdown-toggle.btn-default:hover{\n  box-shadow: none;\n  background: #fff;\n}\n\ngumga-list .smart-footer-item ul{\n  margin-top: -32px;\n  width: 136px !important;\n  min-height: 48px;\n  max-height: 256px;\n  overflow-y: auto;\n  padding: 0;\n  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)!important;\n  transition: all .4s cubic-bezier(.25,.8,.25,1)!important;\n  border-radius: 2px!important;\n  border: none!important;\n}\n\ngumga-list .smart-footer-item{\n  font-size: 13px;\n}\n\ngumga-list  .dropdown-menu {\n    -webkit-transition: all .5s ease-out;\n    transition: all .5s ease-out;\n    transform: rotateX(90deg);\n    transform-origin: top;\n    opacity: 0;\n    display: block;\n}\n\ngumga-list  .open .dropdown-menu {\n    opacity: 1;\n    transform: rotateX(0deg);\n    transform-origin: top;\n}\n\ngumga-list .smart-footer-item ul li{\n  cursor: pointer;\n  padding: 16px 16px;\n  font-size: 12px;\n  color: rgba(0,0,0,0.87);\n  background: #F5F5F5 !important;\n  align-items: center;\n  height: 48px;\n}\n\ngumga-list .smart-footer-item ul li.search{\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\ngumga-list .smart-footer-item ul li.search input{\n  border: none;\n  border-radius: 0;\n  box-shadow: none;\n  background: #fff;\n}\n\ngumga-list .smart-footer-item ul li.selected{\n  color: rgb(33,150,243);\n}\n\ngumga-list .panel .panel-footer, gumga-list .panel .panel-heading{\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  -webkit-flex-wrap: wrap-reverse;\n  -ms-flex-wrap: wrap-reverse;\n  flex-wrap: wrap-reverse;\n  box-sizing: border-box;\n  padding: 0px 24px;\n  font-size: 12px;\n  color: rgba(0,0,0,.54);\n  border-top: 1px rgba(0,0,0,.12) solid !important;\n}\n\ngumga-list .panel .panel-footer .page-select, gumga-list .panel .panel-heading .page-select{\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  height: 56px;\n}\n\ngumga-list td[class*=\"td-checkbox\"], gumga-list th, gumga-list td[class*=\"ng-binding\"]{\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\n  padding: 17px 0px 0px 24px !important;\n  color: rgba(0,0,0,.87) !important;\n  font-size: 13px !important;\n  border-top: 1px rgba(0,0,0,.12) solid !important;\n}\n\ngumga-list tr td < span:nth-child(n+10) {\n    background-color:red !important;\n}\n\ngumga-list .table-responsive{\n  border: none;\n}\n\ngumga-list .smart-grid-fixed{\n  /*border-: #f5f5f5 !important;*/\n}\n\n\ngumga-list .pure-checkbox input[type=\"checkbox\"], .pure-radiobutton input[type=\"checkbox\"], .pure-checkbox input[type=\"radio\"], .pure-radiobutton input[type=\"radio\"] {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:focus + label:before, .pure-radiobutton input[type=\"checkbox\"]:focus + label:before, .pure-checkbox input[type=\"radio\"]:focus + label:before, .pure-radiobutton input[type=\"radio\"]:focus + label:before, .pure-checkbox input[type=\"checkbox\"]:hover + label:before, .pure-radiobutton input[type=\"checkbox\"]:hover + label:before, .pure-checkbox input[type=\"radio\"]:hover + label:before, .pure-radiobutton input[type=\"radio\"]:hover + label:before {\n  border-color: #4f8196;\n  background-color: #f2f2f2;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:active + label:before, .pure-radiobutton input[type=\"checkbox\"]:active + label:before, .pure-checkbox input[type=\"radio\"]:active + label:before, .pure-radiobutton input[type=\"radio\"]:active + label:before { transition-duration: 0s; }\n\ngumga-list .pure-checkbox input[type=\"checkbox\"] + label, .pure-radiobutton input[type=\"checkbox\"] + label, .pure-checkbox input[type=\"radio\"] + label, .pure-radiobutton input[type=\"radio\"] + label {\n  position: relative;\n  padding-left: 2em;\n  vertical-align: middle;\n  user-select: none;\n  cursor: pointer;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"] + label:before, .pure-radiobutton input[type=\"checkbox\"] + label:before, .pure-checkbox input[type=\"radio\"] + label:before, .pure-radiobutton input[type=\"radio\"] + label:before {\n  box-sizing: content-box;\n  content: '';\n  color: #4f8196;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  width: 14px;\n  height: 14px;\n  margin-top: -9px;\n  border: 2px solid #4f8196;\n  text-align: center;\n  transition: all 0.4s ease;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"] + label:after, .pure-radiobutton input[type=\"checkbox\"] + label:after, .pure-checkbox input[type=\"radio\"] + label:after, .pure-radiobutton input[type=\"radio\"] + label:after {\n  box-sizing: content-box;\n  content: '';\n  background-color: #4f8196;\n  position: absolute;\n  top: 50%;\n  left: 4px;\n  width: 10px;\n  height: 10px;\n  margin-top: -5px;\n  transform: scale(0);\n  transform-origin: 50%;\n  transition: transform 200ms ease-out;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:disabled + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled + label:before, .pure-checkbox input[type=\"radio\"]:disabled + label:before, .pure-radiobutton input[type=\"radio\"]:disabled + label:before { border-color: #cccccc; }\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:disabled:focus + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:focus + label:before, .pure-checkbox input[type=\"radio\"]:disabled:focus + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:focus + label:before, .pure-checkbox input[type=\"checkbox\"]:disabled:hover + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:hover + label:before, .pure-checkbox input[type=\"radio\"]:disabled:hover + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:hover + label:before { background-color: inherit; }\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:disabled:checked + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:checked + label:before, .pure-checkbox input[type=\"radio\"]:disabled:checked + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:checked + label:before { background-color: #cccccc; }\n\ngumga-list .pure-checkbox input[type=\"checkbox\"] + label:after, .pure-radiobutton input[type=\"checkbox\"] + label:after {\n  background-color: transparent;\n  top: 50%;\n  left: 4px;\n  width: 8px;\n  height: 3px;\n  margin-top: -4px;\n  border-style: solid;\n  border-color: #ffffff;\n  border-width: 0 0 3px 3px;\n  border-image: none;\n  transform: rotate(-45deg) scale(0);\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:checked + label:after, .pure-radiobutton input[type=\"checkbox\"]:checked + label:after {\n  content: '';\n  transform: rotate(-45deg) scale(1);\n  transition: transform 200ms ease-out;\n}\n\ngumga-list .pure-checkbox input[type=\"radio\"]:checked + label:before, .pure-radiobutton input[type=\"radio\"]:checked + label:before {\n  animation: borderscale 300ms ease-in;\n  background-color: white;\n}\n\ngumga-list .pure-checkbox input[type=\"radio\"]:checked + label:after, .pure-radiobutton input[type=\"radio\"]:checked + label:after { transform: scale(1); }\n\ngumga-list .pure-checkbox input[type=\"radio\"] + label:before, .pure-radiobutton input[type=\"radio\"] + label:before, .pure-checkbox input[type=\"radio\"] + label:after, .pure-radiobutton input[type=\"radio\"] + label:after { border-radius: 50%; }\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:checked + label:before, .pure-radiobutton input[type=\"checkbox\"]:checked + label:before {\n  animation: borderscale 200ms ease-in;\n  background: #4f8196;\n}\n\ngumga-list .pure-checkbox input[type=\"checkbox\"]:checked + label:after, .pure-radiobutton input[type=\"checkbox\"]:checked + label:after { transform: rotate(-45deg) scale(1); }\n\n@keyframes\nborderscale {  50% {\n box-shadow: 0 0 0 2px #4f8196;\n}\n}\n\n\n";

},{}],4:[function(require,module,exports){
'use strict';

var _listMaterialDesign = require('./list-material-design');

var _listMaterialDesign2 = _interopRequireDefault(_listMaterialDesign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./list-creator.factory.js');
require('./grid.js');

List.$inject = ['$compile', 'listCreator'];

function List($compile, listCreator) {

  controller.$inject = ['$scope', '$element', '$attrs', '$timeout', '$sce'];

  function controller($scope, $element, $attrs, $timeout, $sce) {
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
        })[0] || { name: column };
        var title = configuration.title || column.charAt(0).toUpperCase() + column.slice(1),
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
    ctrl.pageModel = ctrl.pageModel || 1;
    ctrl.pageAlign = ctrl.pageAlign || "flex-end"; // flex-end, flex-start center
    ctrl.pagePosition = ctrl.pagePosition ? ctrl.pagePosition : "BOTTOM"; // top , bottom, all
    ctrl.listConfig = ctrl.listConfig || {};
    ctrl.sort = hasAttr('sort') ? ctrl.sort : angular.noop;
    ctrl.class = hasAttr('class') ? defaultCssClass.concat($attrs.class || ' ') : defaultCssClass;
    ctrl.onClick = hasAttr('onClick') ? ctrl.onClick : angular.noop;
    ctrl.onDoubleClick = hasAttr('onDoubleClick') ? ctrl.onDoubleClick : angular.noop;
    ctrl.onSort = hasAttr('onSort') ? ctrl.onSort : angular.noop;
    ctrl.changePerPage = hasAttr('changePerPage') ? ctrl.changePerPage : angular.noop;

    // Garantindo que existam todas as configurações necessárias no objeto.
    function guaranteeConfig() {
      ctrl.listConfig.headers = ctrl.listConfig.hasOwnProperty('headers') ? !!ctrl.listConfig.headers : defaultHeaders;
      ctrl.listConfig.checkbox = !!ctrl.listConfig.checkbox;
      ctrl.listConfig.selection = hasConfig('selection') ? ctrl.listConfig.selection : defaultSelection;
      ctrl.listConfig.itemsPerPage = hasConfig('itemsPerPage') ? ctrl.listConfig.itemsPerPage : defaultItemsPerPage;
      ctrl.listConfig.sortDefault = hasConfig('sortDefault') ? ctrl.listConfig.sortDefault : defaultSortedColumn;
      ctrl.listConfig.conditional = hasConfig('conditional') ? ctrl.listConfig.conditional : angular.noop;
      ctrl.listConfig.columnsConfig = guaranteeColumns(ctrl.listConfig.columns, ctrl.listConfig.columnsConfig);
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

    $scope.$watch('ctrl.config', function (value) {
      ctrl.listConfig = angular.copy(value);
      guaranteeConfig();
      compileElement();
      handlingGrid();
    });

    $scope.$watch('ctrl.data', function () {
      updateMap(ctrl.data);
      handlingGrid();
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
      if (selectedValues.length > 1 && ctrl.listConfig.selection == 'single') {
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
      var obj = ctrl.listConfig.conditional(value);
      var trueValue = void 0,
          falseValue = void 0;
      for (var key in obj) {
        obj[key] === true ? trueValue = key : falseValue = key;
      }

      if (trueValue) return '\"'.concat(trueValue).concat('\"');
      return '\'\'';
    }

    function conditionalTableCell(value, ordering) {
      var columnToGetTheConditional = ctrl.listConfig.columnsConfig.filter(function (val) {
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

      if (ctrl.listConfig.selection != 'none') {
        if (event.target.name == '$checkbox' && ctrl.listConfig.selection == 'single') uncheckSelectedMap();
        if (event.target.name == '$checkbox' && ctrl.listConfig.selection == 'multi') ctrl.selectedMap[index].checkbox = !ctrl.selectedMap[index].checkbox;
        if (ctrl.checkAll) ctrl.checkAll = false;
        if (ctrl.listConfig.selection == 'single' && !ctrl.selectedMap[index].checkbox) uncheckSelectedMap();
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
      var element = angular.element(listCreator.mountTable(ctrl.listConfig, ctrl.class, _listMaterialDesign2.default));
      $element.append($compile(element)($scope));
    }
    try {
      compileElement();
    } catch (err) {}

    var handlingGrid = function handlingGrid() {
      if (ctrl.listConfig.fixed) {
        $timeout(function () {
          return $element.find('table').smartGrid(ctrl.listConfig.fixed);
        });
      }
    };

    ctrl.getTotalPage = function () {
      var res = [];
      for (var i = 1; i <= Math.ceil(ctrl.count / ctrl.pageSize); i++) {
        res.push(i);
      }
      return res;
    };

    ctrl.changePage = function (page, itensPerPage) {
      if (ctrl.onPageChange) {
        ctrl.pageSize = itensPerPage || ctrl.pageSize;
        ctrl.pageModel = page || ctrl.pageModel;
        ctrl.onPageChange({ page: page, pageSize: ctrl.pageSize });
      }
    };

    ctrl.previousPage = function () {
      if (ctrl.onPageChange && ctrl.existsPreviousPage()) {
        ctrl.onPageChange({ page: ctrl.pageModel - 1, pageSize: ctrl.pageSize });
        ctrl.pageModel = ctrl.pageModel - 1;
      }
    };

    ctrl.roundNumber = function (count, pageSize, pageModel) {
      var round = pageSize * pageModel;
      if (Math.floor(round) >= count) return count;
      return round;
    };

    ctrl.existsPreviousPage = function () {
      return ctrl.pageModel - 1 > 0;
    };

    ctrl.existsNextPage = function () {
      return ctrl.pageModel + 1 <= Math.ceil(ctrl.count / ctrl.pageSize);
    };

    ctrl.nextPage = function () {
      if (ctrl.onPageChange && ctrl.existsNextPage()) {
        ctrl.onPageChange({ page: ctrl.pageModel + 1, pageSize: ctrl.pageSize });
        ctrl.pageModel = ctrl.pageModel + 1;
      }
    };

    ctrl.inputPageChange = function (evt) {
      if (evt.keyCode == 13) {
        if (ctrl.onPageChange && Number(evt.target.value) <= Math.ceil(ctrl.count / ctrl.pageSize)) {
          ctrl.onPageChange({ page: evt.target.value, pageSize: ctrl.pageSize });
          ctrl.pageModel = Number(evt.target.value);
        }
      }
    };

    ctrl.trustAsHtml = function (string) {
      return $sce.trustAsHtml(string);
    };
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
      'changePerPage': '&?',
      'maxHeight': '@?',
      'pagePosition': '@?',
      'pageAlign': '@?',
      'pageSize': '=?',
      'count': '=?',
      'pageModel': '=?',
      'onPageChange': '&?'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: controller
  };
}

angular.module('gumga.list', ['gumga.list.creator']).directive('gumgaList', List);

},{"./grid.js":1,"./list-creator.factory.js":2,"./list-material-design":3}]},{},[4]);

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

                var handlingFixed = function handlingFixed(parent, e) {
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
                };

                var setParent = function setParent() {
                    var parent = angular.element(settings.parent);
                    var table = angular.element(settings.table);
                    parent.css({
                        'overflow-x': 'auto',
                        'overflow-y': 'auto'
                    });

                    var lastMoment = 0;

                    angular.element(parent).bind('touchmove', function (ev) {
                        handlingFixed(parent, ev);
                    });

                    parent.scroll(function (ev) {
                        ev.stopPropagation();ev.preventDefault();
                        handlingFixed(parent, ev);
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
                        if (element[0].style.backgroundColor) return;

                        var elementBackground = element.css("background-color");
                        elementBackground = elementBackground == "transparent" || elementBackground == "rgba(0, 0, 0, 0)" ? null : elementBackground;

                        var parentBackground = parent.css("background-color");
                        parentBackground = parentBackground == "transparent" || parentBackground == "rgba(0, 0, 0, 0)" ? null : parentBackground;

                        var background = parentBackground ? parentBackground : "white";
                        background = elementBackground ? elementBackground : background;
                        // element.css("background-color", background);
                        element.css("touch-action", "manipulation");
                        // element.css("border-top", "1px solid rgba(168, 159, 159, 0.12)");
                        element.css("background-clip", "padding-box");
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("ngSmartGridResize", []);

angular.module("ngSmartGridResize").directive('resizeable', ['resizeStorage', '$injector', function (resizeStorage, $injector) {

    function link(scope, element, attr) {
        // Set global reference to table
        var table = element;
        var container = null;

        // Set global reference to container
        container = scope.container ? $(scope.container) : $(table).parent();

        // Add css styling/properties to table
        $(table).addClass('resize');

        // Initialise handlers, bindings and modes
        initialiseAll(table, attr, scope);

        // Bind utility functions to scope object
        bindUtilityFunctions(table, attr, scope);

        // Watch for mode changes and update all
        watchModeChange(table, attr, scope);

        function bindUtilityFunctions(table, attr, scope) {
            if (scope.bind === undefined) return;
            scope.bind = {
                update: function update() {
                    cleanUpAll(table);
                    initialiseAll(table, attr, scope);
                }
            };
        }

        function watchModeChange(table, attr, scope) {
            scope.$watch(function () {
                return scope.mode;
            }, function () /*newMode*/{
                cleanUpAll(table);
                initialiseAll(table, attr, scope);
            });
        }

        function cleanUpAll(table) {
            table.isFirstDrag = true;
            deleteHandles(table);
        }

        function resetTable(table) {
            $(table).outerWidth('100%');
            $(table).find('th').width('auto');
        }

        function deleteHandles(table) {
            $(table).find('th').find('.handle').remove();
        }

        function initialiseAll(table, attr, scope) {
            // Get all column headers
            table.columns = $(table).find('th');
            table.mode = scope.mode;

            // Get the resizer object for the current mode
            var ResizeModel = getResizer(scope);
            if (!ResizeModel) return;
            table.resizer = new ResizeModel(table, table.columns, container);

            // Load column sized from saved storage
            table.cache = resizeStorage.loadTableSizes(table, scope.mode);

            // Decide which columns should have a handler attached
            table.handleColumns = table.resizer.handles(table.columns);

            // Decide which columns are controlled and resized
            table.ctrlColumns = table.resizer.ctrlColumns;

            // Execute setup function for the given resizer mode
            table.resizer.setup();

            // Set column sizes from cache
            setColumnSizes(table.cache);

            // Initialise all handlers for every column
            table.handleColumns.each(function (index, column) {
                initHandle(table, column);
            });
        }

        function setColumnSizes(cache) {
            if (!cache) {
                resetTable(table);
                return;
            }
            $(table).width('auto');

            angular.element(table)[0].loadResize = function () {
                table.ctrlColumns.each(function (index, column) {
                    var id = $(column).attr('id');
                    var cacheWidth = cache[id];
                    angular.element(column).css({ width: cacheWidth });
                });
            };

            angular.element(table)[0].loadResize();

            table.resizer.onTableReady();
        }

        function initHandle(table, column) {
            // Prepend a new handle div to the column
            var handle = $('<div>', {
                class: 'handle'
            });

            // var oldContent = angular.element(angular.element(column).html());
            //
            //
            // handle.prepend(oldContent);

            $(column).prepend(handle);

            // Make handle as tall as the table
            //$(handle).height($(table).height())

            // Use the middleware to decide which columns this handle controls
            var controlledColumn = table.resizer.handleMiddleware(handle, column);

            // Bind mousedown, mousemove & mouseup events
            bindEventToHandle(table, handle, controlledColumn);
        }

        function bindEventToHandle(table, handle, column) {

            // This event starts the dragging
            $(handle).mousedown(function (event) {
                if (table.isFirstDrag) {
                    table.resizer.onFirstDrag(column, handle);
                    table.resizer.onTableReady();
                    table.isFirstDrag = false;
                }

                var optional = {};
                if (table.resizer.intervene) {
                    optional = table.resizer.intervene.selector(column);
                    optional.column = optional;
                    optional.orgWidth = $(optional).width();
                }

                // Prevent text-selection, object dragging ect.
                event.preventDefault();

                // Change css styles for the handle
                $(handle).addClass('active');

                // Show the resize cursor globally
                $('body').addClass('table-resize');

                // Get mouse and column origin measurements
                var orgX = event.clientX;
                var orgWidth = $(column).width();

                // On every mouse move, calculate the new width
                $(window).mousemove(calculateWidthEvent(column, orgX, orgWidth, optional));

                // Stop dragging as soon as the mouse is released
                $(window).one('mouseup', unbindEvent(handle));
            });
        }

        function calculateWidthEvent(column, orgX, orgWidth, optional) {
            return function (event) {
                // Get current mouse position
                var newX = event.clientX;

                // Use calculator function to calculate new width
                var diffX = newX - orgX;
                var newWidth = table.resizer.calculate(orgWidth, diffX);

                // Use restric function to abort potential restriction
                if (table.resizer.restrict(newWidth)) return;

                // Extra optional column
                if (table.resizer.intervene) {
                    var optWidth = table.resizer.intervene.calculator(optional.orgWidth, diffX);
                    if (table.resizer.intervene.restrict(optWidth)) return;
                    $(optional).width(optWidth);
                }

                // Set size
                $(column).width(newWidth);
            };
        }

        function getResizer(scope) {
            try {
                var Resizer = $injector.get(scope.mode);
                return Resizer;
            } catch (e) {
                console.error("The resizer " + scope.mode + " was not found");
                return null;
            }
        }

        function unbindEvent(handle) {
            // Event called at end of drag
            return function () /*event*/{
                $(handle).removeClass('active');
                $(window).unbind('mousemove');
                $('body').removeClass('table-resize');

                table.resizer.onEndDrag();

                saveColumnSizes();
            };
        }

        function saveColumnSizes() {
            if (!table.cache) table.cache = {};

            $(table.columns).each(function (index, column) {
                var id = $(column).attr('id');
                if (!id) return;
                table.cache[id] = table.resizer.saveAttr(column);
            });

            resizeStorage.saveTableSizes(table, table.mode, table.cache);
        }
    }

    // Return this directive as a object literal
    return {
        restrict: 'A',
        link: link,
        scope: {
            mode: '=',
            bind: '=',
            container: '@'
        }
    };
}]);

angular.module("ngSmartGridResize").service('resizeStorage', ['$window', function ($window) {

    var prefix = "ngColumnResize";

    this.loadTableSizes = function (table, model) {
        var key = getStorageKey(table, model);
        var object = $window.sessionStorage.getItem(key);
        return JSON.parse(object);
    };

    this.saveTableSizes = function (table, model, sizes) {
        var key = getStorageKey(table, model);
        if (!key) return;
        var string = JSON.stringify(sizes);
        $window.sessionStorage.setItem(key, string);
    };

    function getStorageKey(table, mode) {
        var id = table.attr('id');
        if (!id) {
            console.error("Table has no id", table);
            return undefined;
        }
        return prefix + '.' + table.attr('id') + '.' + mode;
    }
}]);

angular.module("ngSmartGridResize").factory("ResizerModel", [function () {

    function ResizerModel(table, columns, container) {
        this.minWidth = 25;

        this.table = table;
        this.columns = columns;
        this.container = container;

        this.handleColumns = this.handles();
        this.ctrlColumns = this.ctrlColumns();
    }

    ResizerModel.prototype.setup = function () {
        // Hide overflow by default
        // $(this.container).css({
        //     overflowX: 'hidden'
        // })
    };

    ResizerModel.prototype.onTableReady = function () {
        // Table is by default 100% width
        $(this.table).outerWidth('100%');
    };

    ResizerModel.prototype.handles = function () {
        // By default all columns should be assigned a handle
        return this.columns;
    };

    ResizerModel.prototype.ctrlColumns = function () {
        // By default all columns assigned a handle are resized
        return this.handleColumns;
    };

    ResizerModel.prototype.onFirstDrag = function () {
        // By default, set all columns to absolute widths
        $(this.ctrlColumns).each(function (index, column) {
            $(column).width($(column).width());
        });
    };

    ResizerModel.prototype.handleMiddleware = function (handle, column) {
        // By default, every handle controls the column it is placed in
        return column;
    };

    ResizerModel.prototype.restrict = function (newWidth) {
        // By default, the new width must not be smaller that min width
        return newWidth < this.minWidth;
    };

    ResizerModel.prototype.calculate = function (orgWidth, diffX) {
        // By default, simply add the width difference to the original
        return orgWidth + diffX;
    };

    ResizerModel.prototype.onEndDrag = function () {
        // By default, do nothing when dragging a column ends
        return;
    };

    ResizerModel.prototype.saveAttr = function (column) {
        return $(column).outerWidth();
    };

    return ResizerModel;
}]);

angular.module("ngSmartGridResize").factory("BasicResizer", ["ResizerModel", function (ResizerModel) {

    function BasicResizer(table, columns, container) {
        // Call super constructor
        ResizerModel.call(this, table, columns, container);

        // All columns are controlled in basic mode
        this.ctrlColumns = this.columns;

        this.intervene = {
            selector: interveneSelector,
            calculator: interveneCalculator,
            restrict: interveneRestrict
        };
    }

    // Inherit by prototypal inheritance
    BasicResizer.prototype = Object.create(ResizerModel.prototype);

    function interveneSelector(column) {
        return $(column).next();
    }

    function interveneCalculator(orgWidth, diffX) {
        return orgWidth - diffX;
    }

    function interveneRestrict(newWidth) {
        return newWidth < 25;
    }

    BasicResizer.prototype.setup = function () {
        // Hide overflow in mode fixed
        // $(this.container).css({
        //     overflowX: 'hidden'
        // })

        // First column is auto to compensate for 100% table width
        $(this.columns).first().css({
            width: 'auto'
        });
    };

    BasicResizer.prototype.handles = function () {
        // Mode fixed does not require handler on last column
        return $(this.columns).not(':last');
    };

    BasicResizer.prototype.onFirstDrag = function () {
        // Replace all column's width with absolute measurements
        $(this.columns).each(function (index, column) {
            $(column).width($(column).width());
        });
    };

    BasicResizer.prototype.onEndDrag = function () {
        // Calculates the percent width of each column
        var totWidth = $(this.table).outerWidth();

        var totPercent = 0;

        $(this.columns).each(function (index, column) {
            var colWidth = $(column).outerWidth();
            var percentWidth = colWidth / totWidth * 100 + '%';
            totPercent += colWidth / totWidth * 100;
            $(column).css({ width: percentWidth });
        });
    };

    BasicResizer.prototype.saveAttr = function (column) {
        return $(column)[0].style.width;
    };

    // Return constructor
    return BasicResizer;
}]);

angular.module("ngSmartGridResize").factory("FixedResizer", ["ResizerModel", function (ResizerModel) {

    function FixedResizer(table, columns, container) {
        // Call super constructor
        ResizerModel.call(this, table, columns, container);

        this.fixedColumn = $(table).find('th').first();
        this.bound = false;
    }

    // Inherit by prototypal inheritance
    FixedResizer.prototype = Object.create(ResizerModel.prototype);

    FixedResizer.prototype.setup = function () {
        // Hide overflow in mode fixed
        // $(this.container).css({
        //     overflowX: 'hidden'
        // })

        // First column is auto to compensate for 100% table width
        $(this.columns).first().css({
            width: 'auto'
        });
    };

    FixedResizer.prototype.handles = function () {
        // Mode fixed does not require handler on last column
        return $(this.columns).not(':last');
    };

    FixedResizer.prototype.ctrlColumns = function () {
        // In mode fixed, all but the first column should be resized
        return $(this.columns).not(':first');
    };

    FixedResizer.prototype.onFirstDrag = function () {
        // Replace each column's width with absolute measurements
        $(this.ctrlColumns).each(function (index, column) {
            $(column).width($(column).width());
        });
    };

    FixedResizer.prototype.handleMiddleware = function (handle, column) {
        // Fixed mode handles always controll next neightbour column
        return $(column).next();
    };

    FixedResizer.prototype.restrict = function (newWidth) {
        if (this.bound) {
            if (newWidth < this.bound) {
                $(this.fixedColumn).width('auto');
                this.bound = false;
                return false;
            } else {
                return true;
            }
        } else if (newWidth < this.minWidth) {
            return true;
        } else if ($(this.fixedColumn).width() <= this.minWidth) {
            this.bound = newWidth;
            $(this.fixedColumn).width(this.minWidth);
            return true;
        }
    };

    FixedResizer.prototype.calculate = function (orgWidth, diffX) {
        // Subtract difference - neightbour grows
        return orgWidth - diffX;
    };

    // Return constructor
    return FixedResizer;
}]);

angular.module("ngSmartGridResize").factory("OverflowResizer", ["ResizerModel", function (ResizerModel) {

    function OverflowResizer(table, columns, container) {
        // Call super constructor
        ResizerModel.call(this, table, columns, container);
    }

    // Inherit by prototypal inheritance
    OverflowResizer.prototype = Object.create(ResizerModel.prototype);

    OverflowResizer.prototype.setup = function () {
        // Allow overflow in this mode
        $(this.container).css({
            overflow: 'auto'
        });
    };

    OverflowResizer.prototype.onTableReady = function () {
        // For mode overflow, make table as small as possible
        $(this.table).width(1);
    };

    // Return constructor
    return OverflowResizer;
}]);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


ListCreator.$inject = [];
//TODO: Otimizar estas funções de criação de HTML.
function ListCreator() {
  // TEMPLATE DA VERSÃO SEM MATERIAL DESIGN
  var itemsPerPage = '\n      <div class="row">\n        <div class="col-md-offset-9 col-md-2">\n          <div class="text-right" style="line-height: 30px">\n            <span gumga-translate-tag="gumgalist.itemsperpage"></span>\n          </div>\n        </div>\n        <div class="col-md-1">\n          <select class="form-control input-sm" ng-options="item for item in ctrl.listConfig.itemsPerPage" ng-model="ctrl.selectedItemPerPage">\n          </select>\n        </div>\n      </div>';

  var paginationTemplate = '\n        <div class="page-select">\n          <div class="btn-group smart-footer-item">\n            <button type="button"\n                    class="btn btn-default dropdown-toggle"\n                    data-toggle="dropdown"\n                    aria-haspopup="true"\n                    aria-expanded="false">\n              P\xE1gina: &nbsp; {{ctrl.pageModel}} &nbsp; <span class="caret"></span>\n            </button>\n            <ul class="gmd dropdown-menu">\n              <li class="search">\n                <input type="number" min="1" step="1" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" autofocus max="{{ctrl.getTotalPage()[ctrl.getTotalPage().length - 1]}}" placeholder="P\xE1gina" class="form-control" ng-keypress="ctrl.inputPageChange($event)"/>\n              </li>\n              <li class="effect-ripple {{page == ctrl.pageModel ? \'selected\' : \'\'}}" ng-click="ctrl.changePage(page, ctrl.pageSize)" ng-repeat="page in ctrl.getTotalPage()">\n                {{page}}\n              </li>\n            </ul>\n          </div>\n        </div>\n\n        <div class="page-select" ng-show="ctrl.listConfig.itemsPerPage.length > 0">\n          <div class="btn-group smart-footer-item">\n            <button type="button"\n                    class="btn btn-default dropdown-toggle"\n                    data-toggle="dropdown"\n                    aria-haspopup="true"\n                    aria-expanded="false">\n              Itens por p\xE1gina: &nbsp; {{ctrl.pageSize}} &nbsp; <span class="caret"></span>\n            </button>\n            <ul class="gmd dropdown-menu">\n              <li class="effect-ripple {{itemPerPage == ctrl.pageSize ? \'selected\' : \'\'}}"\n                  ng-click="ctrl.changePage(ctrl.pageModel, itemPerPage)" ng-repeat="itemPerPage in ctrl.listConfig.itemsPerPage">\n                {{itemPerPage}}\n              </li>\n            </ul>\n          </div>\n        </div>\n\n        <div class="page-select">\n          <div class="smart-footer-item">\n            {{ 1+ (ctrl.pageModel-1) * ctrl.pageSize}} - {{ctrl.roundNumber(ctrl.count, ctrl.pageSize, ctrl.pageModel)}} de {{ctrl.count}}\n            <button class="btn" type="button" ng-disabled="!ctrl.existsPreviousPage()" ng-click="ctrl.previousPage()"><i class="effect-ripple glyphicon glyphicon-chevron-left"></i></button>\n            <button class="btn" type="button" ng-disabled="!ctrl.existsNextPage()" ng-click="ctrl.nextPage()"><i class="effect-ripple glyphicon glyphicon-chevron-right"></i></button>\n          </div>\n        </div>\n  ';

  function formatTableHeader(sortField, title, next) {
    var templateWithSort = '\n        <div style="display: flex; justify-content: ' + next.flexColumn + '">\n        <a ng-click="ctrl.doSort(\'' + sortField + '\')" class="th-sort">\n          ' + title + '\n        </a>\n        <span class="sort-caret-span" style="margin-right: 0;{{ctrl.activeSorted.column  == \'' + sortField + '\' ? \'\': \'opacity: 0.4;\'}}" ng-class="ctrl.activeSorted.direction == \'asc\' ? \'dropup\' : \' \' ">\n          <span class="caret"></span>\n        </span>\n        </div>\n';
    return !!sortField ? templateWithSort : title;
  }

  function generateHeader(config, tableId) {
    if (config.headers) {
      return '\n              ' + generateHeaderColumns(config.columnsConfig, undefined, tableId) + '\n        ';
    } else {
      return '';
    }
  }

  function generateHeaderColumns() {
    var columnsArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var hasCheckbox = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var tableId = arguments[2];

    return columnsArray.reduce(function (prev, next, index) {
      return prev += '\n          <th ng-init="ctrl.checkResizer()" id="' + tableId + '-' + next.name + '" style="' + (next.style ? next.style + ';' : '') + 'text-align: ' + next.alignColumn + '; white-space: normal; {{ctrl.listConfig.fixed && ctrl.listConfig.fixed.left ? \'\' : \'z-index: 1;\'}}" class="' + (next.size || ' ') + '">\n            <div class="column-container" ng-show="!ctrl.listConfig.columnsConfig[' + index + '].searching">\n              <i ng-show="ctrl.isPosssibleLeft(\'' + next.name + '\', ' + index + ')"  class="glyphicon glyphicon-triangle-left left" ng-click="ctrl.moveColumn(\'left\', \'' + next.name + '\')"></i>\n                ' + formatTableHeader(next.sortField, next.title, next) + ' \n              <i ng-show="ctrl.isPosssibleRight(\'' + next.name + '\', ' + index + ')" class="glyphicon glyphicon-triangle-right right" ng-click="ctrl.moveColumn(\'right\', \'' + next.name + '\')"></i>\n            \n              <div class="column-search-container" ng-show="ctrl.listConfig.columnsConfig[' + index + '].activeSearch">\n                <button ng-click="ctrl.searchWithGQuery(\'' + next.name + '\', $event)">\n                  <em class="material-icons">search</em>\n                </button>\n              </div>\n            </div>\n            <div class="column-container-search" ng-show="ctrl.listConfig.columnsConfig[' + index + '].searching">\n              <div class="input-group">\n                <span class="input-group-addon" id="basic-addon1" ng-click="ctrl.executeSearch(ctrl.listConfig.columnsConfig[' + index + '], $event)">\n                  <em class="material-icons">search</em>\n                </span>\n\n                <input  type="text" \n                        autofocus\n                        placeholder="{{ctrl.listConfig.columnsConfig[' + index + '].searchPlaceholder}}" \n                        ng-keydown="ctrl.searchByColumn(ctrl.listConfig.columnsConfig[' + index + '], $event)"\n                        ng-model="ctrl.listConfig.columnsConfig[' + index + '].searchValue"/>\n\n                <span class="input-group-addon" id="basic-addon1" ng-click="ctrl.removeSearch(ctrl.listConfig.columnsConfig[' + index + '], $event)">\n                  <em class="material-icons">clear</em>\n                </span>\n              </div>\n            </div>\n          </th>\n          ';
    }, ' ');
  }

  function generateBody(columnsArray) {
    return columnsArray.reduce(function (prev, next) {
      if (next.name == "$checkbox") {
        return prev += '\n            <td class="' + next.size + ' td-checkbox" ng-class="ctrl.checkConditions($value)" ng-style="{\'border-left\': {{ ctrl.conditionalTableCell($value,\'' + next.name + '\') }} }"> ' + next.content + '</td>';
      }
      return prev += '\n                <td   class="' + next.size + '"\n                      style="text-align: ' + next.alignRows + ';"\n                      ng-class="ctrl.checkConditions($value)"\n                      ng-dblclick="ctrl.editInline($event, $value, \'' + next.name + '\')"\n                      ng-style="{\'border-left\': {{ ctrl.conditionalTableCell($value,\'' + next.name + '\') }} }">\n                      ' + next.content + '\n                </td>\n            ';
    }, ' ');
  }

  function mountTable(config, className, style, tableId, styleMaterial, listName) {
    if (config.checkbox) {
      config.columnsConfig.unshift({
        title: '\n              <div class="pure-checkbox">\n                  <input type="checkbox"\n                         ng-model="ctrl.checkAll"\n                         ng-change="ctrl.selectAll(ctrl.checkAll)"\n                         ng-show="\'' + config.selection + '\' === \'multi\'"/>\n                         <label ng-click="ctrl.checkAll = !ctrl.checkAll; ctrl.selectAll(ctrl.checkAll)"></label>\n                </div>',
        name: '$checkbox',
        content: '<div class="pure-checkbox">\n                    <input  name="$checkbox"\n                            type="checkbox"\n                            ng-model="ctrl.selectedMap[$index].checkbox"/>\n                            <label></label>\n                  </div>',
        size: 'col-md-1',
        conditional: angular.noop
      });
    }

    if (config.materialTheme) {
      var style = document.createElement('style'),
          head = document.getElementsByTagName('head')[0];
      style.innerHTML = styleMaterial;
      style.id = 'gumga-list' + ('-' + listName || '');
      head.insertBefore(style, head.firstChild);
    }

    return '\n        ' + (config.itemsPerPage.length > 0 && !config.materialTheme ? itemsPerPage : ' ') + '\n        <div class="{{ctrl.listConfig.materialTheme ? \'gmd panel\': \'\'}}" style="position: relative;">\n          <div class="page-select"\n              ng-show="ctrl.getPossibleColumns().length > 0 && !(ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0))"     \n              style="position: absolute;right: 35px;z-index: 10;top: 15px;">\n                <div class="btn-group smart-footer-item">\n                  <button class="btn btn-default dropdown-toggle "\n                          data-toggle="dropdown"\n                          type="button"\n                          aria-haspopup="true"\n                          aria-expanded="false" style="font-size: 14px;">\n                          <span class="glyphicon glyphicon-plus"></span>\n                  </button>\n                  <ul class="gmd dropdown-menu" style="margin-left: -120px;margin-top: -20px;">\n                    <li style="border-bottom: 1px solid #ddd;">\n                      <label>Adicionar colunas</label>\n                    </li>\n                    <li class="effect-ripple"\n                        ng-repeat="column in ctrl.getPossibleColumns() track by $index"\n                        ng-click="ctrl.addColumn(column)">\n                        {{column.label || column.name}}\n                    </li>\n                  </ul>\n                </div>\n          </div>\n          <div ng-show="(ctrl.listConfig.materialTheme\n                        && ((ctrl.listConfig.actions.length > 0\n                        || ctrl.listConfig.title)\n                        || ctrl.listConfig.enabledBetweenLines))\n                        && !(ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0))"\n               class="{{ctrl.listConfig.materialTheme ? \'panel-actions\': \'\'}}">\n              <h4 ng-show="ctrl.listConfig.title">{{ctrl.listConfig.title}}</h4>\n              <div class="actions">\n                <div  ng-repeat="action in ctrl.listConfig.actions"\n                      ng-click="action.onClick(ctrl.selectedValues, ctrl.data)"\n                      style="float: left;padding-left: 15px;"\n                      class="{{ctrl.selectedValues.length > 0 ? action.classOnSelectedValues : action.classOnNotSelectedValues}}"\n                      ng-bind-html="ctrl.trustAsHtml(action.icon)"></div>\n\n                <div style="float: left;padding-left: 15px;" ng-show="ctrl.listConfig.enabledBetweenLines">\n                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(25)" style="font-size: 14px;"></i>\n                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(48)" style="font-size: 16px;margin-left: 5px;"></i>\n                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(60)" style="font-size: 20px;margin-left: 5px;"></i>\n                </div>\n              </div>\n          </div>\n          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == \'TOP\' || ctrl.pagePosition.toUpperCase() == \'ALL\') && !(ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0))"\n               class="{{ctrl.listConfig.materialTheme ? \'panel-heading\': \'\'}}"\n               style="justify-content: {{ctrl.pageAlign}};">\n              ' + paginationTemplate + '\n          </div>\n          <div ng-show="!(ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0))" class="{{ctrl.listConfig.materialTheme ? \'panel-body\': \'\'}}" style="padding: 0;">\n            <div class="table-responsive" style="{{ctrl.maxHeight ? \'max-height: \'+ctrl.maxHeight : \'\'}}">\n              \n              <div class="progress" ng-show="ctrl.loading">\n                <div class="indeterminate"></div>\n              </div>\n\n              <table class="' + className + '" ' + (config.resizable ? 'resizeable mode="\'BasicResizer\'" ' : ' ') + ' id="' + tableId + '">\n                <thead>\n                  <tr>\n                    ' + generateHeader(config, tableId) + '\n                  </tr>\n                </thead>\n                <tbody ng-init="ctrl.checkResizer()">\n                  <tr ng-style="{ \'border-left\': {{ctrl.conditional($value)}} }"\n                      style="{{ctrl.rowIsDisabled(ctrl.selectedMap[$index].value) ? \'opacity: 0.4;\' : \'\'}}"\n                      class="{{ctrl.rowIsDisabled(ctrl.selectedMap[$index].value) ? \'row-disabled\' : \'\'}} "\n                      ng-dblclick="ctrl.doubleClick($value)"\n                      ng-class="ctrl.selectedMap[$index].checkbox ? \'active active-list\' : \'\'"\n                      ng-repeat="$value in ctrl.data track by $index"\n                      ng-init="ctrl.checkResizer()"\n                      ng-show="ctrl.visibleRow($value)"\n                      ng-click="ctrl.select($index,$event)">\n                      ' + generateBody(config.columnsConfig) + '\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n          <div ng-if="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == \'BOTTOM\' || ctrl.pagePosition.toUpperCase() == \'ALL\') && !(ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0))"                 \n               class="{{ctrl.listConfig.materialTheme ? \'panel-footer gumga-list-paginable\': \'\'}}"\n               style="justify-content: {{ctrl.pageAlign}};">\n               \n              ' + paginationTemplate + '\n          </div>\n          \n          <div class="panel-body gumga-list-empty" align="center" ng-show="ctrl.listConfig.empty.enabled && (ctrl.data && ctrl.data.length == 0)">\n              <h3>{{ctrl.listConfig.empty.title ? ctrl.listConfig.empty.title : \'Nenhum registro foi criado\'}}</h3>\n              <p>{{ctrl.listConfig.empty.description ? ctrl.listConfig.empty.description : \'Clique em + para criar um novo registro.\'}}</p>\n          </div>\n\n        </div>\n        ';
  }

  return { mountTable: mountTable };
}

angular.module('gumga.list.creator', []).factory('listCreator', ListCreator);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n\nGUMGA_LIST_KEY table th .column-container, GUMGA_LIST_KEY table th a.th-sort{\n  color: rgba(0,0,0,.54);\n  font-size: 12px;\n  font-weight: 700;\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\n}\n\nGUMGA_LIST_KEY table thead tr{\n  border: none;\n}\n\nGUMGA_LIST_KEY .gumga-list-empty h3{\n  color: #222;\n  font-size: 18px;\n  white-space: nowrap;\n  margin-bottom: 20px;\n}\n\nGUMGA_LIST_KEY .gumga-list-empty p{\n  color: #888888;\n  font-size: 16px;\n  position: relative;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  -moz-transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  -o-transform: translateY(-50%);\n  transform: translateY(-50%);\n  white-space: nowrap;\n}\n\nGUMGA_LIST_KEY table.resize th {\n  position: relative;\n  min-width: 10px ;\n}\n\nGUMGA_LIST_KEY .panel.gmd{\n  padding: 0;\n}\n\nGUMGA_LIST_KEY .column-search-container{\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n\nGUMGA_LIST_KEY .column-search-container button{\n  margin-right: 25px;\n  border: none;\n  background: transparent;\n  outline: none;\n  opacity: 0;\n  pointer-events: none;\n  color: #ccc;\n}\n\nGUMGA_LIST_KEY .column-container-search{\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n}\n\nGUMGA_LIST_KEY .column-container-search .input-group{\n  height: 100%;\n}\n\nGUMGA_LIST_KEY .column-container-search .input-group .input-group-addon{\n  border: none;\n  background: transparent;\n}\n\nGUMGA_LIST_KEY .column-container-search input{\n  height: 100%;\n  width: 100%;\n  border: none;\n  outline: none;\n  color: #666;\n  padding: 0 15px 0 15px;\n}\n\nGUMGA_LIST_KEY em.material-icons{\n  font-size: 18px;\n  vertical-align: middle;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY .column-container-search .input-group em[class~=\"fa-search\"]{\n  font-size: 14px;\n  vertical-align: middle;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY .table>thead>tr>th:hover .column-search-container button{\n  opacity: 1;\n  pointer-events: all;\n}\n\n\n/**\n  START PERSONALIZE ROWS\n**/\n\nGUMGA_LIST_KEY tr td, GUMGA_LIST_KEY tr th{\n  background-color: #FFFFFF;\n  border-top: 1px solid rgba(168, 159, 159, 0.12) !important;\n}\n\nGUMGA_LIST_KEY tr:hover td{\n  background-color: HOVER_ROW_COLOR;\n  border-top: 1px solid rgba(168, 159, 159, 0.12) !important;\n}\n\n/**\n  END PERSONALIZE ROWS\n**/\n\n\nGUMGA_LIST_KEY table th i{\n  display: none;\n}\n\nGUMGA_LIST_KEY table td[contenteditable=\"true\"]{\n  border: 1px solid #175bc1;\n}\n\nGUMGA_LIST_KEY table th i.left{\n  font-size: 10px;\n  color: #ccc;\n  position: absolute;\n  left: 5px;\n  top: 18px;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY table th i.right{\n  font-size: 10px;\n  color: #ccc;\n  position: absolute;\n  right: 5px;\n  top: 18px;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY table th:hover i{\n  display: block;\n}\n\nGUMGA_LIST_KEY table.resize tr th .handle {\n    width: 2px;\n    height: 100%;\n    position: absolute;\n    top: 0;\n    right: 0px;\n    cursor: ew-resize ;\n    background: #f3f3f3;\n    z-index: 9999999;\n}\n\nGUMGA_LIST_KEY table.resize tr th .handle.active {\n    background: #ddd;\n}\n\n@media only screen and (max-device-width: 480px) {\n\n    GUMGA_LIST_KEY table.resize tr th .handle {\n        display: none;\n    }\n\n}\n\nGUMGA_LIST_KEY .table{\n  margin: 0;\n}\n\nGUMGA_LIST_KEY tr{\n  transition: background-color .2s;\n  height: LINE_HEIGHT_VALUE;\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\n  border-top: 1px solid rgba(168, 159, 159, 0.12);\n}\n\nGUMGA_LIST_KEY tr th a:hover{\n  color: #525252;\n  text-decoration: none;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY .panel-footer, GUMGA_LIST_KEY .panel-heading{\n  padding: 10px;\n  text-align: right;\n  background-color: #fff;\n  border-top: 0;\n  padding-bottom: 0;\n}\n\nGUMGA_LIST_KEY .panel-actions{\n  border-bottom: 1px solid transparent;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n  flex-wrap: wrap-reverse;\n  box-sizing: border-box;\n  font-size: 12px;\n  color: rgba(0,0,0,.87);\n  background-color: #fff;\n  padding: 10px 24px;\n  display: flex;\n  padding-top: 0;\n  padding-bottom: 0;\n  height: 64px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\nGUMGA_LIST_KEY .panel-actions .actions{\n  margin-left: auto;\n  padding-top: 10px;\n}\n\nGUMGA_LIST_KEY .panel-actions .actions i,  GUMGA_LIST_KEY .panel-actions .actions span{\n  font-size: 20px;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY .table>thead>tr>th{\n  border: none;\n  vertical-align: middle;\n  position: relative;\n  font-weight: 500;\n}\n\n\n.effect-ripple {\n  position: relative;\n  overflow: hidden;\n  transform: translate3d(0, 0, 0);\n}\n.effect-ripple:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);\n  background-repeat: no-repeat;\n  background-position: 50%;\n  transform: scale(10, 10);\n  opacity: 0;\n  transition: transform .5s, opacity 1s;\n}\n.effect-ripple:active:after {\n  transform: scale(0, 0);\n  opacity: .2;\n  transition: 0s;\n}\n\nGUMGA_LIST_KEY .signal {\n  border: 5px solid #333;\n  border-radius: 30px;\n  height: 30px;\n  left: 35px;\n  opacity: 0;\n  position: absolute;\n  width: 30px;\n  animation: pulsate 1s ease-out;\n  animation-iteration-count: infinite;\n}\n\n@keyframes pulsate {\n    0% {\n      transform: scale(.1);\n      opacity: 0.0;\n    }\n    50% {\n      opacity: 1;\n    }\n    100% {\n      transform: scale(1.2);\n      opacity: 0;\n    }\n}\n\nGUMGA_LIST_KEY .panel .panel-body{\n  margin: 0 ;\n}\n\nGUMGA_LIST_KEY .table>tbody>tr.active>td,\nGUMGA_LIST_KEY .table>tbody>tr.active>th{\n   background: ACTIVE_ROW_COLOR;\n   border: none;\n}\n\nGUMGA_LIST_KEY .table>tbody>tr.active:hover>td,\nGUMGA_LIST_KEY .table>tbody>tr.active>:hover > th{\n  background: HOVER_ROW_COLOR ;\n}\n\n\nGUMGA_LIST_KEY .smart-footer-item button{\n  border: none ;\n  outline: none ;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  font-size: 13px;\n  padding-top: 0;\n  padding-bottom: 0;\n  box-shadow: none;\n}\n\nGUMGA_LIST_KEY .smart-footer-item > button:hover, GUMGA_LIST_KEY .smart-footer-item > button:active{\n  background: #fff;\n  outline: none ;\n  color: #000000;\n  box-shadow: none;\n}\n\nGUMGA_LIST_KEY .btn-default.active.focus, .btn-default.active:focus, .btn-default.active:hover, .btn-default:active.focus, .btn-default:active:focus, .btn-default:active:hover, .open>.dropdown-toggle.btn-default.focus, .open>.dropdown-toggle.btn-default:focus, .open>.dropdown-toggle.btn-default:hover{\n  box-shadow: none;\n  background: #fff;\n}\n\nGUMGA_LIST_KEY .smart-footer-item ul{\n  margin-top: -32px;\n  width: 136px;\n  max-width: 136px;\n  min-height: 48px;\n  max-height: 256px;\n  overflow-y: auto;\n  padding: 0;\n  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);\n  transition: all .4s cubic-bezier(.25,.8,.25,1);\n  border-radius: 2px;\n  border: none;\n}\n\nGUMGA_LIST_KEY .smart-footer-item{\n  font-size: 13px;\n}\n\nGUMGA_LIST_KEY  .dropdown-menu {\n    -webkit-transition: all .5s ease-out;\n    transition: all .5s ease-out;\n    transform: rotateX(90deg);\n    transform-origin: top;\n    opacity: 0;\n    display: block;\n}\n\nGUMGA_LIST_KEY  .open .dropdown-menu {\n    opacity: 1;\n    transform: rotateX(0deg);\n    transform-origin: top;\n}\n\nGUMGA_LIST_KEY .smart-footer-item ul li{\n  cursor: pointer;\n  padding: 16px 16px;\n  font-size: 12px;\n  color: rgba(0,0,0,0.87);\n  background: #F5F5F5;\n  align-items: center;\n  height: 48px;\n}\n\nGUMGA_LIST_KEY .smart-footer-item ul li.search{\n  margin: 0;\n  padding: 0;\n}\n\nGUMGA_LIST_KEY .smart-footer-item ul li.search input{\n  border: none;\n  border-radius: 0;\n  box-shadow: none;\n  background: #fff;\n}\n\nGUMGA_LIST_KEY .smart-footer-item ul li.selected{\n  color: rgb(33,150,243);\n}\n\nGUMGA_LIST_KEY .panel .panel-footer, GUMGA_LIST_KEY .panel .panel-heading{\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  -webkit-flex-wrap: wrap-reverse;\n  -ms-flex-wrap: wrap-reverse;\n  flex-wrap: wrap-reverse;\n  box-sizing: border-box;\n  padding: 0px 24px;\n  font-size: 12px;\n  color: rgba(0,0,0,.54);\n  border-top: 1px rgba(0,0,0,.12) solid;\n}\n\nGUMGA_LIST_KEY .panel .panel-footer .page-select, GUMGA_LIST_KEY .panel .panel-heading .page-select{\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  height: 56px;\n}\n\nGUMGA_LIST_KEY .input-inline-edit{\n    background: transparent ;\n    border: none ;\n    outline: 1px solid #ccc ;\n    padding-left: 1px ;\n    padding-right: 1px ;\n    max-width: 100% ;\n    width: 100% ;\n}\n\nGUMGA_LIST_KEY td[class*=\"td-checkbox\"], GUMGA_LIST_KEY th, GUMGA_LIST_KEY td[class*=\"ng-binding\"]{\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\n  color: rgba(0,0,0,.87);\n  font-size: 13px;\n  border-top: 1px solid rgba(168, 159, 159, 0.12);\n  vertical-align: middle;\n}\n\nGUMGA_LIST_KEY .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th{\n  padding: 10px 5px 10px 24px !important;\n  \n}\n\n\nGUMGA_LIST_KEY table td:not(:empty){\n   padding: 0px 24px 0px 24px !important;\n   vertical-align: middle !important;\n}\n\nGUMGA_LIST_KEY tr td < span:nth-child(n+10) {\n    background-color:red ;\n}\n\nGUMGA_LIST_KEY .table-responsive{\n  position: relative;\n  border: none;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"], .pure-radiobutton input[type=\"checkbox\"], .pure-checkbox input[type=\"radio\"], .pure-radiobutton input[type=\"radio\"] {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:focus + label:before, .pure-radiobutton input[type=\"checkbox\"]:focus + label:before, .pure-checkbox input[type=\"radio\"]:focus + label:before, .pure-radiobutton input[type=\"radio\"]:focus + label:before, .pure-checkbox input[type=\"checkbox\"]:hover + label:before, .pure-radiobutton input[type=\"checkbox\"]:hover + label:before, .pure-checkbox input[type=\"radio\"]:hover + label:before, .pure-radiobutton input[type=\"radio\"]:hover + label:before {\n  border-color: CHECKBOX_COLOR;\n  background-color: #f2f2f2;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:active + label:before, .pure-radiobutton input[type=\"checkbox\"]:active + label:before, .pure-checkbox input[type=\"radio\"]:active + label:before, .pure-radiobutton input[type=\"radio\"]:active + label:before { transition-duration: 0s; }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"] + label, .pure-radiobutton input[type=\"checkbox\"] + label, .pure-checkbox input[type=\"radio\"] + label, .pure-radiobutton input[type=\"radio\"] + label {\n  position: relative;\n  padding-left: 2em;\n  vertical-align: middle;   \n  user-select: none;\n  cursor: pointer;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"] + label:before, .pure-radiobutton input[type=\"checkbox\"] + label:before, .pure-checkbox input[type=\"radio\"] + label:before, .pure-radiobutton input[type=\"radio\"] + label:before {\n  box-sizing: content-box;\n  content: '';\n  color: CHECKBOX_COLOR;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  width: 14px;\n  height: 14px;\n  margin-top: -9px;\n  border: 2px solid CHECKBOX_COLOR;\n  text-align: center;\n  border-radius: 3px;\n  transition: all 0.4s ease;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"] + label:after, .pure-radiobutton input[type=\"checkbox\"] + label:after, .pure-checkbox input[type=\"radio\"] + label:after, .pure-radiobutton input[type=\"radio\"] + label:after {\n  box-sizing: content-box;\n  content: '';\n  background-color: CHECKBOX_COLOR;\n  position: absolute;\n  top: 50%;\n  left: 4px;\n  width: 10px;\n  height: 10px;\n  margin-top: -5px;\n  transform: scale(0);\n  transform-origin: 50%;\n  transition: transform 200ms ease-out;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:disabled + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled + label:before, .pure-checkbox input[type=\"radio\"]:disabled + label:before, .pure-radiobutton input[type=\"radio\"]:disabled + label:before { border-color: #cccccc; }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:disabled:focus + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:focus + label:before, .pure-checkbox input[type=\"radio\"]:disabled:focus + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:focus + label:before, .pure-checkbox input[type=\"checkbox\"]:disabled:hover + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:hover + label:before, .pure-checkbox input[type=\"radio\"]:disabled:hover + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:hover + label:before { background-color: inherit; }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:disabled:checked + label:before, .pure-radiobutton input[type=\"checkbox\"]:disabled:checked + label:before, .pure-checkbox input[type=\"radio\"]:disabled:checked + label:before, .pure-radiobutton input[type=\"radio\"]:disabled:checked + label:before { background-color: #cccccc; }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"] + label:after, .pure-radiobutton input[type=\"checkbox\"] + label:after {\n  background-color: transparent;\n  top: 50%;\n  left: 4px;\n  width: 8px;\n  height: 3px;\n  margin-top: -4px;\n  border-style: solid;\n  border-color: #ffffff;\n  border-width: 0 0 3px 3px;\n  border-image: none;\n  transform: rotate(-45deg) scale(0);\n}\n\nGUMGA_LIST_KEY .pure-checkbox{\n  width: 18px;\n  display: inline-block;\n}\n\nGUMGA_LIST_KEY .sort-caret-span{\n    display: flex;\n    align-items: center;\n    margin-right: 17px;\n    margin-left: 5px;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:checked + label:after, .pure-radiobutton input[type=\"checkbox\"]:checked + label:after {\n  content: '';\n  transform: rotate(-45deg) scale(1);\n  transition: transform 200ms ease-out;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"radio\"]:checked + label:before, .pure-radiobutton input[type=\"radio\"]:checked + label:before {\n  animation: borderscale 300ms ease-in;\n  background-color: white;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"radio\"]:checked + label:after, .pure-radiobutton input[type=\"radio\"]:checked + label:after { transform: scale(1); }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"radio\"] + label:before, .pure-radiobutton input[type=\"radio\"] + label:before, .pure-checkbox input[type=\"radio\"] + label:after, .pure-radiobutton input[type=\"radio\"] + label:after { border-radius: 50%; }\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:checked + label:before, .pure-radiobutton input[type=\"checkbox\"]:checked + label:before {\n  animation: borderscale 200ms ease-in;\n  background: CHECKBOX_COLOR;\n}\n\nGUMGA_LIST_KEY .pure-checkbox input[type=\"checkbox\"]:checked + label:after, .pure-radiobutton input[type=\"checkbox\"]:checked + label:after { transform: rotate(-45deg) scale(1); }\n\n@keyframes\nborderscale {  50% {\n box-shadow: 0 0 0 2px CHECKBOX_COLOR;\n}\n}\n\n\n \n/* Progress Bar */\nGUMGA_LIST_KEY .progress {\n  position: absolute;\n  z-index: 2;\n  top: 42px;\n  height: 2px;\n  display: block;\n  width: 100%;\n  border-radius: 2px;\n  background-clip: padding-box;\n  margin: 0.5rem 0 1rem 0;\n  overflow: hidden; }\n  GUMGA_LIST_KEY .progress .determinate {\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    bottom: 0;\n    background-color: #LOADING_COLOR;\n    transition: width .3s linear; }\n    GUMGA_LIST_KEY .progress .indeterminate {\n    background-color: LOADING_COLOR; }\n    GUMGA_LIST_KEY .progress .indeterminate:before {\n      content: '';\n      position: absolute;\n      background-color: inherit;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      will-change: left, right;\n      -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n              animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite; }\n    GUMGA_LIST_KEY .progress .indeterminate:after {\n      content: '';\n      position: absolute;\n      background-color: inherit;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      will-change: left, right;\n      -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n              animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n      -webkit-animation-delay: 1.15s;\n              animation-delay: 1.15s; }\n\n@-webkit-keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n@keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n@-webkit-keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n@keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n\n";

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _listMaterialDesign = __webpack_require__(3);

var _listMaterialDesign2 = _interopRequireDefault(_listMaterialDesign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(2);
__webpack_require__(0);
__webpack_require__(1);

List.$inject = ['$compile', 'listCreator'];

function List($compile, listCreator) {

  controller.$inject = ['$scope', '$element', '$attrs', '$timeout', '$sce'];

  function controller($scope, $element, $attrs, $timeout, $sce) {
    var ctrl = this;

    var errorMessages = {
      noData: 'O componente gumgaList necessita de um atributo data, que irá conter os dados que serão visualizados.',
      noConfig: 'O componente gumgaList necessita de um atributo config, que irá conter a configuração necessária.',
      noColumns: 'O componente gumgaList necessita que, no objeto de configuração, exista um atributo columns.',
      perPageNoArray: 'O atributo itemsPerPage do gumgaList precisa ser um array, por exemplo - itemsPerPage: [5, 10, 15]'
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
            size = configuration.resizable && configuration.size ? configuration.size : ' ',
            name = configuration.name || column,
            editable = configuration.editable || false,
            possibleColumn = configuration.possibleColumn || false,
            label = configuration.label || column,
            content = configuration.content || '{{$value.' + column + '}}',
            sortField = configuration.sortField || null,
            activeSearch = configuration.activeSearch || false,
            alignColumn = configuration.alignColumn || 'left',
            searchPlaceholder = configuration.searchPlaceholder || 'Buscar...',
            alignRows = configuration.alignRows || 'left',
            widthPorcentage = configuration.widthPorcentage || undefined,
            conditional = configuration.conditional || angular.noop,
            flexColumn = configuration.alignColumn == 'left' ? 'flex-start' : configuration.alignColumn == 'center' ? 'flex-start' : configuration.alignColumn == 'right' ? 'flex-end' : 'flex-start';
        return { searchPlaceholder: searchPlaceholder, title: title, size: size, name: name, content: content, sortField: sortField, conditional: conditional, editable: editable, possibleColumn: possibleColumn, label: label, alignColumn: alignColumn, alignRows: alignRows, widthPorcentage: widthPorcentage, activeSearch: activeSearch, flexColumn: flexColumn };
      });
    }

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

    function init() {
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

      // Tratamento de erros do componente.
      if (!hasAttr('data')) console.error(errorMessages.noData);
      if (!hasAttr('configuration')) console.error(errorMessages.noConfig);
      if (!hasConfig('columns')) console.error(errorMessages.noColumns);
    }

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

    if (ctrl.config && ctrl.config.sortDefault && ctrl.config.sortDefault != null) ctrl.doSort(ctrl.config.sortDefault);

    $scope.$parent.selectedValues = ctrl.selectedValues;

    $scope.$watch('ctrl.config', function (value) {
      applyConfig(value);
    });

    var applyConfig = function applyConfig(value) {
      if (!value) return;
      if (Object.keys(value).length == 0) return;
      init();
      value.columnsConfig.forEach(function (column) {
        if (column.possibleColumn) {
          value.columns = value.columns.replace(/\s/g, '');
          value.columns = ctrl.replaceAll(value.columns, ',' + column.name, '');
          value.columns = ctrl.replaceAll(value.columns, column.name + ',', '');
          value.columns = ctrl.replaceAll(value.columns, column.name, '');
        }
      });
      ctrl.listConfig = angular.copy(value);
      guaranteeConfig();
      compileElement();
      handlingGrid();
      inactiveLoading();
      ctrl.analyzeColumnsWidth();
    };

    var isLoading = function isLoading(data) {
      return data.filter(function (row) {
        return row['LIST-LOADING'];
      }).length > 0;
    };

    $scope.$watch('ctrl.data', function (data) {
      if (ctrl.updatingRow) return;
      updateMap(ctrl.data);
      handlingGrid();
      if (!isLoading(data)) {
        inactiveLoading();
      }
      if (data) {
        data.filter(function (row) {
          if (ctrl.selectedValues.filter(function (selected) {
            return angular.equals(selected, row);
          }).length == 0) {
            ctrl.selectedValues = [];
            updateMap(data, true);
          }
        });
      }
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
      var createNew = arguments[1];

      ctrl.selectedMap = ctrl.selectedMap && !createNew ? ctrl.selectedMap : {};
      if (ctrl.loading) ctrl.selectedMap = {};
      newVal.forEach(function (value, index) {
        return ctrl.selectedMap[index] = ctrl.selectedMap[index] || { checkbox: false, value: value };
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
      if (ctrl.activeSorted.direction) {
        activeLoading();
      }
      ctrl.activeSorted.column = sortField;
      ctrl.activeSorted.direction = ctrl.activeSorted.direction == 'asc' ? 'desc' : 'asc';
      ctrl.sort({ field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction, pageSize: ctrl.pageSize });
      if (ctrl.onSort) {
        ctrl.onSort({ field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction, pageSize: ctrl.pageSize });
      }
    }

    function activeLoading() {
      ctrl.loading = true;
      ctrl.data.push({ 'LIST-LOADING': true });
    }

    function inactiveLoading() {
      ctrl.loading = false;
    }

    function doubleClick($value) {
      ctrl.onDoubleClick({ $value: $value });
    }

    function changePerPage(value) {
      if (ctrl.changePerPage) {
        ctrl.changePerPage({ value: value });
      }
    }

    ctrl.rowIsDisabled = function (row) {
      if (!ctrl.config.disabledRow) return false; //linha não disabilitada
      var rowIsDisabled = ctrl.config.disabledRow(row);
      if (typeof rowIsDisabled === "boolean") {
        return rowIsDisabled;
      }
      return false;
    };

    ctrl.checkConditions = function (row) {
      if (!ctrl.listConfig.conditionalClass) return "";
      var rowClass = ctrl.listConfig.conditionalClass(row);
      if (rowClass && (typeof rowClass === 'undefined' ? 'undefined' : _typeof(rowClass)) == "object") {
        return rowClass;
      }
      return "";
    };

    function select(index) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { target: {} };

      if (ctrl.listConfig.selection != 'none' && !ctrl.rowIsDisabled(ctrl.selectedMap[index].value)) {
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
        if (!ctrl.rowIsDisabled(ctrl.selectedMap[value].value)) {
          ctrl.selectedMap[value].checkbox = boolean;
        }
      });
      updateSelectedValues();
    }

    ctrl.applyLoadingDistance = function () {
      $timeout(function () {
        $element.find('div.progress').css({
          top: ($element.find('table').find('thead')[0].clientHeight || 48) - 4
        });
      });
    };

    // Compilação do componente na tela.
    function compileElement() {
      $element.html('');
      var element = angular.element(listCreator.mountTable(ctrl.listConfig, ctrl.class, _listMaterialDesign2.default, ctrl.getTableId(), ctrl.getStyleMaterialDesign(), ctrl.name));
      $element.append($compile(element)($scope));
    }
    try {
      compileElement();
    } catch (err) {}

    var handlingGrid = function handlingGrid() {
      ctrl.applyLoadingDistance();
      if (!ctrl.listConfig) return;
      if (ctrl.listConfig.fixed) {
        $timeout(function () {
          return $element.find('table').smartGrid(ctrl.listConfig.fixed);
        });
      }
      if (ctrl.config.ordination && !ctrl.appyCache) {
        ctrl.appyCache = true;
        var cache = ctrl.getOrderColumnsStorage();
        if (cache) {
          ctrl.config.columns = cache;
          ctrl.config = angular.copy(ctrl.config);
        }
      }
    };

    ctrl.analyzeColumnsWidth = function () {
      var configKey = 'ngColumnResize.' + ctrl.getTableId() + '.BasicResizer';
      if (ctrl.listConfig.columnsConfig) {
        var config = {};
        ctrl.listConfig.columnsConfig.forEach(function (column) {
          if (column.widthPorcentage) {
            config[ctrl.getTableId() + '-' + column.name] = column.widthPorcentage + '%';
          }
        });
        if (Object.keys(config).length > 0) {
          config[ctrl.getTableId() + '-$checkbox'] = '4%';
          sessionStorage.setItem(configKey, JSON.stringify(config));
        }
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
        if (page != ctrl.pageModel || itensPerPage != ctrl.pageSize) {
          activeLoading();
        }
        ctrl.pageSize = itensPerPage || ctrl.pageSize;
        ctrl.pageModel = page || ctrl.pageModel;
        ctrl.selectedMap = {};
        ctrl.onPageChange({ page: page, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
      }
    };

    ctrl.previousPage = function () {
      if (ctrl.onPageChange && ctrl.existsPreviousPage()) {
        activeLoading();
        ctrl.selectedMap = {};
        ctrl.onPageChange({ page: ctrl.pageModel - 1, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
        ctrl.pageModel = ctrl.pageModel - 1;
      }
    };

    ctrl.nextPage = function () {
      if (ctrl.onPageChange && ctrl.existsNextPage()) {
        activeLoading();
        ctrl.selectedMap = {};
        ctrl.onPageChange({ page: ctrl.pageModel + 1, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
        ctrl.pageModel = ctrl.pageModel + 1;
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

    ctrl.inputPageChange = function (evt) {
      if (evt.keyCode == 13) {
        if (ctrl.onPageChange && Number(evt.target.value) <= Math.ceil(ctrl.count / ctrl.pageSize) && evt.target.value != ctrl.pageModel) {
          activeLoading();
          ctrl.onPageChange({ page: evt.target.value, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction });
          ctrl.pageModel = Number(evt.target.value);
        }
      }
    };

    ctrl.trustAsHtml = function (string) {
      return $sce.trustAsHtml(string);
    };

    ctrl.replaceAll = function (style, needle, replacement) {
      return style.replace(new RegExp(needle, 'g'), replacement);
    };

    ctrl.getStyleMaterialDesign = function () {
      var height = ctrl.listConfig.lineHeight || 48;
      var s = ctrl.replaceAll(_listMaterialDesign2.default, 'LINE_HEIGHT_VALUE', height + 'px');
      if (ctrl.name) {
        s = ctrl.replaceAll(s, 'GUMGA_LIST_KEY', 'gumga-list[name="' + ctrl.name + '"]');
      } else {
        s = ctrl.replaceAll(s, 'GUMGA_LIST_KEY', 'gumga-list');
      }
      var checkboxColor = ctrl.listConfig.checkboxColor || '#4f8196';
      var loadingColor = ctrl.listConfig.loadingColor || '#4f8196';
      var activeLineColor = ctrl.listConfig.activeLineColor || '#f5f5f5';
      var hoverLineColor = ctrl.listConfig.hoverLineColor || activeLineColor;
      s = ctrl.replaceAll(s, 'ACTIVE_ROW_COLOR', activeLineColor);
      s = ctrl.replaceAll(s, 'HOVER_ROW_COLOR', hoverLineColor);
      s = ctrl.replaceAll(s, 'CHECKBOX_COLOR', checkboxColor);
      s = ctrl.replaceAll(s, 'LOADING_COLOR', loadingColor);
      return s;
    };

    ctrl.handlingLineHeight = function (height) {
      ctrl.listConfig.lineHeight = height;
      ctrl.getStyleMaterialDesign();
    };

    ctrl.editInline = function (ev, row, column) {
      if (ctrl.rowIsDisabled(row)) {
        return;
      }
      var columnConfig = ctrl.listConfig.columnsConfig.filter(function (val) {
        return val.name == column;
      })[0];
      if (columnConfig && columnConfig.editable) {
        ev.stopPropagation();
        angular.element(ev.target).attr('contenteditable', true);
        var value = angular.element(ev.target).html();
        ctrl.updateVal(ev.target, row, column, value.trim());
      }
    };

    ctrl.rowUpdate = function (ev, currentEle, row, column) {
      var rowModified = angular.copy(row);
      angular.element(ev.target).attr('contenteditable', false);
      if (ctrl.updatingRow) return;
      ctrl.updatingRow = true;
      var newValue = angular.element(ev.target).text().trim();
      rowModified[column] = newValue;
      if (!ctrl.onRowChange) {
        throw "O gumga-list precisa que você informe o atributo on-row-change para saber quando os registros forem alterados.";
      }
      ctrl.onRowChange({ row: rowModified });
      $timeout(function () {
        ctrl.updatingRow = false;
      }, 100);
    };

    ctrl.updateVal = function (currentEle, row, column, value) {
      currentEle.focus();
      $timeout(function () {
        angular.element(currentEle).select();
      }, 10);
      angular.element(currentEle).keydown(function (ev) {
        if (ev.keyCode == 13) {
          ev.preventDefault();
          ev.stopPropagation();
          ctrl.rowUpdate(ev, currentEle, row, column);
          return false;
        }
      });
      angular.element(currentEle).blur(function (ev) {
        ctrl.rowUpdate(ev, currentEle, row, column);
      });
      angular.element(currentEle).click(function (e) {
        e.stopPropagation();
      });
    };

    ctrl.getPossibleColumns = function () {
      var toReturn = ctrl.config.columnsConfig.filter(function (column) {
        return column.possibleColumn;
      });
      return toReturn;
    };

    ctrl.addColumn = function (column) {
      column.possibleColumn = false;
      ctrl.config.columns = column.name + ',' + ctrl.config.columns;
      ctrl.config.columnsConfig.unshift(column);
      ctrl.config = angular.copy(ctrl.config);
    };

    ctrl.getTableId = function () {
      var ramdomId = window.Math.random().toString();
      return ctrl.name ? 'gumga-list-' + ctrl.name : 'gumga-list-' + ctrl.replaceAll(ramdomId, '.', '');
    };

    ctrl.moveColumn = function (direction, columnName) {
      var columns = ctrl.config.columns.replace(/\s/g, '');
      columns = columns.split(',');

      var columnIndex = columns.indexOf(columnName);
      switch (direction.toLowerCase()) {
        case 'left':
          var columnNameRemove = columns[columnIndex - 1];
          columns[columnIndex - 1] = columnName;
          columns[columnIndex] = columnNameRemove;
          break;
        case 'right':
          var columnNameRemove = columns[columnIndex + 1];
          columns[columnIndex + 1] = columnName;
          columns[columnIndex] = columnNameRemove;
          break;
      }
      ctrl.config.columns = columns.toString();
      ctrl.config = angular.copy(ctrl.config);
      ctrl.setOrderColumnsStorage(ctrl.config.columns);
    };

    ctrl.isPosssibleLeft = function (columnName, index) {
      if (!ctrl.listConfig.ordination) return false;
      if (columnName == '$checkbox' || index == 0) return false;
      if (ctrl.listConfig.checkbox && index == 1) return false;
      return true;
    };

    ctrl.isPosssibleRight = function (columnName, index) {
      if (!ctrl.listConfig.ordination) return false;
      if (columnName == '$checkbox') return false;
      if (index == ctrl.listConfig.columnsConfig.length - 1) return false;
      return true;
    };

    ctrl.setOrderColumnsStorage = function (columns) {
      window.sessionStorage.setItem('ngColumnOrder.gumga-list-' + ctrl.getTableId(), columns);
    };

    ctrl.getOrderColumnsStorage = function (columns) {
      return window.sessionStorage.getItem('ngColumnOrder.gumga-list-' + ctrl.getTableId());
    };

    ctrl.checkResizer = function () {
      if ($element.find('table')[0] && $element.find('table')[0].loadResize) {
        $element.find('table')[0].loadResize();
      }
    };

    ctrl.searchWithGQuery = function (columnName, evt) {
      ctrl.listConfig.columnsConfig.forEach(function (column, index) {
        if (column.name == columnName) {
          ctrl.listConfig.columnsConfig[index].searching = column.name == columnName;
          $timeout(function () {
            return angular.element(evt.target).closest('th').find('input').focus();
          });
        }
      });
    };

    ctrl.removeSearch = function (column, evt) {
      column.searchValue = '';
      column.searching = false;
      ctrl.executeSearch(column, evt);
    };

    ctrl.executeSearch = function (column, evt) {
      if (ctrl.config.searchFunction && ctrl.data) {
        var gQuery = void 0;
        if (!ctrl.data[0] || typeof ctrl.data[0][column.name] == 'string') {
          var criteria = new Criteria(column.name, ComparisonOperator.CONTAINS, column.searchValue);
          criteria.setFieldFunction('%s');
          criteria.setValueFunction('%s');
          gQuery = new GQuery(criteria);
        } else {
          var _criteria = new Criteria(column.name, ComparisonOperator.EQUAL, column.searchValue);
          gQuery = new GQuery(_criteria);
        }
        activeLoading();
        ctrl.config.searchFunction(gQuery, ctrl.pageModel, ctrl.pageSize, ctrl.activeSorted.column, ctrl.activeSorted.direction);
      } else {
        console.error('É necessário colocar o atributo "searchFunction" na configuração da tabela, esse método será executado quando o usuário tentar fazer uma busca.');
      }
    };

    ctrl.searchByColumn = function (column, evt) {
      if (evt.keyCode == 13) {
        evt.preventDefault();
        evt.stopPropagation();
        ctrl.executeSearch(column, evt);
      }
    };

    ctrl.visibleRow = function (row) {
      return !row['LIST-LOADING'];
    };
  }

  return {
    restrict: 'E',
    scope: {
      'name': '@?',
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
      'onPageChange': '&?',
      'onRowChange': '&?',
      'activeSorted': '=?'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    transclude: true,
    controller: controller
  };
}

angular.module('gumga.list', ['gumga.list.creator', 'ngSmartGridResize']).directive('gumgaList', List);

/***/ })
/******/ ]);
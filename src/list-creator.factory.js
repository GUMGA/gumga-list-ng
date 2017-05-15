ListCreator.$inject = [];
//TODO: Otimizar estas funções de criação de HTML.
function ListCreator() {
  const itemsPerPage = `
      <div class="row">
        <div class="col-md-offset-9 col-md-2">
          <div class="text-right" style="line-height: 30px">
            <span gumga-translate-tag="gumgalist.itemsperpage"></span>
          </div>
        </div>
        <div class="col-md-1">
          <select class="form-control input-sm" ng-options="item for item in ctrl.config.itemsPerPage" ng-model="ctrl.selectedItemPerPage">
          </select>
        </div>
      </div>`;

  const paginationTemplate = `
        <div class="page-select">
          <div class="btn-group smart-footer-item">
            <button type="button"
                    class="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
              Página: &nbsp; {{ctrl.pageModel}} &nbsp; <span class="caret"></span>
            </button>
            <ul class="gmd dropdown-menu">
              <li class="search">
                <input type="number" min="1" step="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" autofocus max="{{ctrl.getTotalPage()[ctrl.getTotalPage().length - 1]}}" placeholder="Página" class="form-control" ng-keypress="ctrl.inputPageChange($event)"/>
              </li>
              <li class="effect-ripple {{page == ctrl.pageModel ? 'selected' : ''}}" ng-click="ctrl.changePage(page)" ng-repeat="page in ctrl.getTotalPage()">
                {{page}}
              </li>
            </ul>
          </div>
        </div>

        <div class="page-select" ng-show="ctrl.config.itemsPerPage.length > 0">
          <div class="btn-group smart-footer-item">
            <button type="button"
                    class="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
              Itens por página: &nbsp; {{ctrl.pageSize}} &nbsp; <span class="caret"></span>
            </button>
            <ul class="gmd dropdown-menu">
              <li class="effect-ripple {{itemPerPage == ctrl.pageSize ? 'selected' : ''}}"
                  ng-click="ctrl.changePage(page, itemPerPage)" ng-repeat="itemPerPage in ctrl.config.itemsPerPage">
                {{itemPerPage}}
              </li>
            </ul>
          </div>
        </div>

        <div class="page-select">
          <div class="smart-footer-item">
            {{ 1+ (ctrl.pageModel-1) * ctrl.pageSize}} - {{ctrl.roundNumber(ctrl.count, ctrl.pageSize, ctrl.pageModel)}} de {{ctrl.count}}
            <button class="btn" type="button" ng-disabled="!ctrl.existsPreviousPage()" ng-click="ctrl.previousPage()"><i class="glyphicon glyphicon-chevron-left"></i></button>
            <button class="btn" type="button" ng-disabled="!ctrl.existsNextPage()" ng-click="ctrl.nextPage()"><i class="glyphicon glyphicon-chevron-right"></i></button>
          </div>
        </div>
  `;

  function formatTableHeader(sortField, title) {
    let templateWithSort = `
        <a ng-click="ctrl.doSort('${sortField}')" class="th-sort">
          ${title}
          <span style="{{ctrl.activeSorted.column  == '${sortField}' ? '': 'opacity: 0.4;'}}" ng-class="ctrl.activeSorted.direction == 'asc' ? 'dropup' : ' ' ">
            <span class="caret"></span>
          </span>
        </a>`;
    return !!sortField ? templateWithSort : title;
  }

  function generateHeader(config) {
    if (config.headers) {
      return `
              ${generateHeaderColumns(config.columnsConfig)}
        `
    } else { return '' }
  }

  function generateHeaderColumns(columnsArray = [], hasCheckbox = true) {
    return columnsArray.reduce((prev, next) => {
      return prev += `
          <th style="${next.style || ' '} white-space: nowrap; {{ctrl.listConfig.fixed && ctrl.listConfig.fixed.left ? '' : 'z-index: 1;'}}" class="${next.size || ' '}">
            <strong>
              ${formatTableHeader(next.sortField, next.title)}
            </strong>
          </th>`
    }, ' ')
  }

  function generateBody(columnsArray) {
    return columnsArray.reduce((prev, next) => {
      if(next.name == "$checkbox"){
        return prev += `
            <td class="${next.size} td-checkbox" ng-style="{'border-left': {{ ctrl.conditionalTableCell($value,'${next.name}') }} }"> ${next.content}</td>`;
      }
      return prev += `
          <td class="${next.size}" ng-style="{'border-left': {{ ctrl.conditionalTableCell($value,'${next.name}') }} }"> ${next.content}</td>`;
    }, ' ')
  }



  function mountTable(config, className, style) {
    if (config.checkbox) {
      config.columnsConfig.unshift({
        title: `<div class="pure-checkbox">
                  <input type="checkbox"
                         ng-model="ctrl.checkAll"
                         ng-change="ctrl.selectAll(ctrl.checkAll)"
                         ng-show="'${config.selection}' === 'multi'"/>
                         <label ng-click="ctrl.checkAll = !ctrl.checkAll; ctrl.selectAll(ctrl.checkAll)"></label>
                </div>`,
        name: '$checkbox',
        content: `<div class="pure-checkbox">
                    <input  name="$checkbox"
                            type="checkbox"
                            ng-model="ctrl.selectedMap[$index].checkbox"/>
                            <label></label>
                  </div>`,
        size: 'col-md-1',
        conditional: angular.noop
      })
    }
    return `
        ${config.itemsPerPage.length > 0  && !config.materialTheme ? itemsPerPage : ' '}
        <style ng-if="ctrl.listConfig.materialTheme">${style}</style>
        <div class="{{ctrl.listConfig.materialTheme ? 'gmd panel': ''}}">
          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == 'TOP' || ctrl.pagePosition.toUpperCase() == 'ALL')"
               class="{{ctrl.listConfig.materialTheme ? 'panel-heading': ''}}"
               style="justify-content: {{ctrl.pageAlign}};">
              ${paginationTemplate}
          </div>
          <div class="{{ctrl.listConfig.materialTheme ? 'panel-body': ''}}" style="padding: 0;">
            <div class="table-responsive" style="{{ctrl.maxHeight ? 'max-height: '+ctrl.maxHeight : ''}}">
              <table class="${className}">
                <thead>
                  <tr>
                    ${generateHeader(config)}
                  </tr>
                </thead>
                <tbody>
                <tr ng-style="{ 'border-left': {{ ctrl.conditional($value) }} }"
                    ng-dblclick="ctrl.doubleClick($value)"
                    ng-class="ctrl.selectedMap[$index].checkbox ? 'active active-list' : ''"
                    ng-repeat="$value in ctrl.data track by $index" ng-click="ctrl.select($index,$event)">
                    ${generateBody(config.columnsConfig)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == 'BOTTOM' || ctrl.pagePosition.toUpperCase() == 'ALL')"
               class="{{ctrl.listConfig.materialTheme ? 'panel-footer': ''}}"
               style="justify-content: {{ctrl.pageAlign}};">
              ${paginationTemplate}
          </div>
        </div>
        `;
  }


  return { mountTable };
}

angular.module('gumga.list.creator', [])
  .factory('listCreator', ListCreator);

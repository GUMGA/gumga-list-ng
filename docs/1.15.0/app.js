angular.module('app', ['gumga.list', 'gumga.rest', 'gumga.controller'])
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['gumgaToken'] = 'eterno';
  })
  .controller('Ctrl', function ($http, GumgaRest, gumgaController) {
    var ctrl = this;

    var PessoaService = new GumgaRest('https://gumga.io/security-api/api/user');
    
    gumgaController.createRestMethods(ctrl, PessoaService, 'pessoa');

    ctrl.pessoa.methods.get();

    ctrl.tableConfig = {
      columns: 'name, login',
      checkbox: true,
      materialTheme: true,
      ordination: false,
      resizable: false,
      fixed: {
          head: true,
          left: 2
      },
      searchFunction: (gQuery, page, pageSize, sortField, sortDir) => {
        ctrl.pessoa.methods.createQuery()
          .gQuery(gQuery)
          .page(page)
          .pageSize(pageSize)
          .sort(sortField, sortDir)
          .send();
      },
      columnsConfig: [
        {
          name: 'name',
          activeSearch: true,
          title: 'Nome'
        },
        {
          name: 'login',
          activeSearch: true,
          title: 'E-mail'
        }
      ]
    }

  })

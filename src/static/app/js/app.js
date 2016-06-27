'use strict';


angular.module('mol.controllers',[]);

angular.module('mol', [
  'ngSanitize',
  'ngCookies',
  'ngAnimate',
  'ngTouch',
  'mol.api',
  'mol.filters',
  'mol.services',
  'mol.controllers',
  'mol.loading-indicator',
  'ui.bootstrap',
  'ui.router',
  'percentage',
  'km2',
  'angular-loading-bar',
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.latencyThreshold = 100;
  }])
.config(function($sceDelegateProvider,$stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http*://localhost**',
      'http*://*mol.org/**',
      'http*://api.mol.org/**',
      'http*://mapoflife.github.io/**'
    ]);
  $httpProvider.defaults.useXDomain = true;
  //send cookies
  $httpProvider.defaults.withCredentials = false;
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state(
      'humboldtcore', //this view contains the bones of the Species Info pages (name, pic, & search bar)
      {
        abstract: true,
        views: {
          "": {
            templateUrl: 'static/app/layouts/base-scrolling.html',
            controller: 'molHumboldtCoreCtrl'},
          "@humboldtcore" : {
            templateUrl: 'static/app/layouts/basic.html'
          }
        }

      }
    )
    .state(
      'humboldtcore.home',
      {
        title: 'Humboldt Core',
        views: {
          "content@humboldtcore" :{
            templateUrl: "static/app/views/home/index.html",
            controller: 'molHumboldtCoreHomeCtrl'
          }
        },
        url: '/'
      }
    );
    //Gets rid of the # in the querystring. Wont work on IE
    $locationProvider.html5Mode(true);

}).run(['$state', function($state) {
  $state.originalHrefFunction = $state.href;
  $state.href = function href(stateOrName, params, options) {
    angular.extend(options, {absolute: true});
    var result = $state.originalHrefFunction(stateOrName, params, options);
    if (result) {
      return result.replace('mapoflife.github.io', 'mol.org');
    } else {
      return result;
    }
  }
}]);

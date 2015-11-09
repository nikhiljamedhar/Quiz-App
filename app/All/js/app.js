'use strict';

/* App Module */

var pencilboxApp = angular.module('pencilBoxApp', [
  'ngRoute',
  'pencilboxControllers',
  'pencilboxServices'
]);

pencilboxApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/subjects', {
        templateUrl: 'partials/subject-list.html',
        controller: 'SubjectListCtrl'
      }).
      when('/subjects/:subjectId', {
        templateUrl: 'partials/subject-detail.html',
        controller: 'SubjectDetailCtrl'
      }).
      when('/subjects/single/:subjectId', {
        templateUrl: 'partials/apps-list.html',
        controller: 'AppListCtrl'
      }).
      when('/subjects/:subjectId/:topicId', {
        templateUrl: 'partials/topic-detail.html',
        controller: 'TopicDetailCtrl'
      }).
      when('/search/:keyword', {
        templateUrl: 'partials/search-results.html',
        controller: 'SearchResultCtrl'
      }).
      otherwise({
        redirectTo: '/subjects'
      });
  }]);

'use strict';

/* Controllers */

var pencilboxControllers = angular.module('pencilboxControllers', []);

pencilboxControllers.controller('SubjectListCtrl', ['$scope', 'Subjects',
  function($scope, Subjects) {
    $scope.subjects = Subjects.query();
    //$scope.orderProp = 'age';
  }]);

pencilboxControllers.controller('SubjectDetailCtrl', ['$scope', '$routeParams', 'Subjects',
  function($scope, $routeParams, Subjects) {
    $scope.subjects = Subjects.query();
    $scope.subject = Subjects.query({ Subject: $routeParams.subjectId });
    $scope.current_subject = $routeParams.subjectId;
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() == subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() != subject.toLowerCase();
    };
  }]);

pencilboxControllers.controller('AppListCtrl', ['$scope', '$routeParams', 'Subjects',
  function($scope, $routeParams, Subjects) {
    $scope.subjects = Subjects.query();
    $scope.apps = Subjects.query({ Subject: $routeParams.subjectId });
    $scope.current_subject = $routeParams.subjectId;
    $scope.invokeCommand = function(command) {
      CommandApi.invokeCommand(command);
    };
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() == subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() != subject.toLowerCase();
    };
  }]);

pencilboxControllers.controller('TopicDetailCtrl', ['$scope', '$routeParams', 'Subjects',
  function($scope, $routeParams, Subjects) {
    $scope.subjects = Subjects.query();
    $scope.subject = Subjects.query({ Subject: $routeParams.subjectId });
    $scope.apps = Subjects.query({ Subject: $routeParams.subjectId, Topic: $routeParams.topicId });
    $scope.current_subject = $routeParams.subjectId;
    $scope.current_topic = $routeParams.topicId;
    $scope.isCurrentTopic = function(topic) {
      return $scope.current_topic.toLowerCase() == topic.toLowerCase();
    };
    $scope.isNotCurrentTopic = function(topic) {
      return $scope.current_topic.toLowerCase() != topic.toLowerCase();
    };
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() == subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() != subject.toLowerCase();
    };
    $scope.invokeCommand = function(command) {
      CommandApi.invokeCommand(command);
    };
  }]);

pencilboxControllers.controller('SearchResultCtrl', ['$scope', '$routeParams', 'Subjects', 'Apps',
  function($scope, $routeParams, Subjects, Apps) {
    $scope.subjects = Subjects.query();
    $scope.apps = Apps.query();
    $scope.queryString = $routeParams.keyword;
    $scope.invokeCommand = function(command) {
      CommandApi.invokeCommand(command);
    };
  }]);

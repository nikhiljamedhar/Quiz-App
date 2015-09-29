"use strict";
// pencilBoxApp.controller('SubjectListController',['$scope','Subjects',
//   function($scope, Subjects){
//     $scope.subjects = Subjects.query();
//   }]);

pencilBoxApp.controller('GradeListController', ['$scope', 'Grades',
  function($scope, Grades){
    $scope.grades = Grades.query();
      console.log($scope.grades)
  }]);

pencilBoxApp.controller('SubjectListController', ['$scope', '$routeParams', 'Subjects', 'Grades',
  function($scope, $routeParams, Subjects, Grades) {
    $scope.subjects = Subjects.query({gradeId : $routeParams.gradeId });

    $scope.current_subject = $scope.subjects[0] ? $scope.subjects[0].id : "";
    $scope.current_grade = $routeParams.gradeId;
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() === subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
    };
  }]);

pencilBoxApp.controller('ChapterListController', ['$scope', '$routeParams', 'Chapters', 'Subjects',
  function ($scope, $routeParams, Chapters, Subjects){
    $scope.subjects = Subjects.query({ gradeId : $routeParams.gradeId });
    $scope.chapters = Chapters.query({ subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });
    $scope.current_grade = $routeParams.gradeId;
    //$scope.current_chapter="";
    $scope.current_subject = $routeParams.subjectId;
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() === subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
    };
  }]);

pencilBoxApp.controller('ContentListController', ['$scope', '$routeParams', 'Contents', 'Chapters', 'Subjects',
  function ($scope, $routeParams, Contents, Chapters, Subjects){
    $scope.current_grade = $routeParams.gradeId;
    $scope.current_subject = $routeParams.subjectId;
    $scope.current_chapter = $routeParams.chapterId;
    $scope.subjects = Subjects.query({ gradeId : $routeParams.gradeId});
    $scope.chapters = Chapters.query({ subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });
    $scope.contents = Contents.query({ chapterId : $routeParams.chapterId,
    subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });

    $scope.showOverlay = function(type, content){
        var innerHTML = "";
        var overlay = new Overlay();
        overlay.setMaskClassName(type);
        if(type === "videos") {
            var videoName = 'videos/' + content.id + '.mp4';
            innerHTML = "<div id='overlayContent'>" +
                        "<video controls autoplay src='"+ videoName +"' class='video'></video>" +
                        "</div>";
            overlay.setContent(innerHTML);
        } else if(type === "quiz") {
            //var path = window.location.hash;
            innerHTML = '<div id="overlayContent"></div>';
            overlay.setContent(innerHTML);

            document.getElementById("overlayContent").appendChild(document.getElementById("test"));

        }
    };
    $scope.isCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() === subject.toLowerCase();
    };
    $scope.isNotCurrentSubject = function(subject) {
      return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
    };
    $scope.isCurrentChapter = function(chapter) {
      return $scope.current_chapter.toLowerCase() === chapter.toLowerCase();
    };
    $scope.isNotCurrentChapter = function(chapter) {
      return $scope.current_chapter.toLowerCase() !== chapter.toLowerCase();
    };
    $scope.invokeCommand = function(command) {
      CommandApi.invokeCommand(command);
    };
    $scope.isApplication = function(type) {
        return type === "apps";
    };
    $scope.isVideo = function(type) {
        return type === "videos";
    };
    $scope.isQuiz = function(type) {
        return type === "quiz";
    };
  }]);

pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, CreateQuiz, Contents, Chapters, Subjects){
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;
        $scope.subjects = Subjects.query({ gradeId : $routeParams.gradeId});
        $scope.chapters = Chapters.query({ subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });
        $scope.contents = Contents.query({ chapterId : $routeParams.chapterId, subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });
        $scope.createQuiz = CreateQuiz.query();
        $scope.currentQuestion = "fill-the-blanks";

        $scope.showOverlay = function(element){
            new Overlay(element);
        };
        $scope.selectQuestion = function($event) {
            if(!$event.currentTarget.classList.contains("highlight")) {
                if($event.currentTarget.parentElement.querySelector(".highlight")) {
                    $event.currentTarget.parentElement.querySelector(".highlight").classList.remove("highlight");
                }
                $event.currentTarget.classList.add("highlight");
                $scope.currentQuestion = $event.currentTarget.dataset.type;
            }
        }
        $scope.isSelected = function(current, type) {
            return current === type;
        }




        $scope.showOverlay(document.getElementById("create-quiz-mask"));

        $scope.isCurrentSubject = function(subject) {
          return $scope.current_subject.toLowerCase() === subject.toLowerCase();
        };
        $scope.isNotCurrentSubject = function(subject) {
          return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
        };
        $scope.isCurrentChapter = function(chapter) {
          return $scope.current_chapter.toLowerCase() === chapter.toLowerCase();
        };
        $scope.isNotCurrentChapter = function(chapter) {
          return $scope.current_chapter.toLowerCase() !== chapter.toLowerCase();
        };
        $scope.invokeCommand = function(command) {
          CommandApi.invokeCommand(command);
        };
        $scope.isApplication = function(type) {
            return type === "apps";
        };
        $scope.isVideo = function(type) {
            return type === "videos";
        };
        $scope.isQuiz = function(type) {
            return type === "quiz";
        };
  }]);

pencilBoxApp.controller('OtherAppController', ['$scope', 'OtherApps',
      function($scope, OtherApps) {
        $scope.otherApps = OtherApps.query();
      }]);
pencilBoxApp.controller('SearchResultController', ['$scope', '$routeParams', 'Apps',
function($scope, $routeParams,  Apps) {
  $scope.keyword = $routeParams.keyword;
  $scope.apps = Apps.query();
  $scope.invokeCommand = function(command) {
  CommandApi.invokeCommand(command);
    };
  }]);

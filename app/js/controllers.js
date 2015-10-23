"use strict";
// pencilBoxApp.controller('SubjectListController',['$scope','Subjects',
//   function($scope, Subjects){
//     $scope.subjects = Subjects.query();
//   }]);

pencilBoxApp.controller('GradeListController', ['$scope', 'Grades', '$http',
    function ($scope, Grades, $http) {
        $scope.grades = Grades.query();
        console.log($scope.grades)
    }]);

pencilBoxApp.controller('SubjectListController', ['$scope', '$routeParams', 'Subjects', 'Grades',
    function ($scope, $routeParams, Subjects, Grades) {
        $scope.subjects = Subjects.query({gradeId: $routeParams.gradeId});

        $scope.current_subject = $scope.subjects[0] ? $scope.subjects[0].id : "";
        $scope.current_grade = $routeParams.gradeId;
        $scope.isCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() === subject.toLowerCase();
        };
        $scope.isNotCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
        };
    }]);

pencilBoxApp.controller('ChapterListController', ['$scope', '$routeParams', 'Chapters', 'Subjects',
    function ($scope, $routeParams, Chapters, Subjects) {
        $scope.subjects = Subjects.query({gradeId: $routeParams.gradeId});
        $scope.chapters = Chapters.query({subjectId: $routeParams.subjectId, gradeId: $routeParams.gradeId});
        $scope.current_grade = $routeParams.gradeId;
        //$scope.current_chapter="";
        $scope.current_subject = $routeParams.subjectId;
        $scope.isCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() === subject.toLowerCase();
        };
        $scope.isNotCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
        };
    }]);

pencilBoxApp.controller('ContentListController', ['$scope', '$routeParams', 'Contents', 'Chapters', 'Subjects', '$location','$http',
    function ($scope, $routeParams, Contents, Chapters, Subjects, $location, $http) {
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;
        $scope.currentPath = function () {
            return $location.path();
        };
        $scope.subjects = Subjects.query({gradeId: $routeParams.gradeId});
        $scope.chapters = Chapters.query({subjectId: $routeParams.subjectId, gradeId: $routeParams.gradeId});
        $scope.contents = Contents.query({
            chapterId: $routeParams.chapterId,
            subjectId: $routeParams.subjectId, gradeId: $routeParams.gradeId
        });

        $scope.showOverlay = function (type, content) {
            var innerHTML = "";
            var overlay = new Overlay();
            overlay.setMaskClassName(type);
            if (type === "videos") {
                var videoName = 'videos/' + content.id + '.mp4';
                innerHTML = "<div id='overlayContent'>" +
                        "<video controls autoplay src='" + videoName + "' class='video'></video>" +
                        "</div>";
                overlay.setContent(innerHTML);
            }
        };
        $scope.isCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() === subject.toLowerCase();
        };
        $scope.isNotCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
        };
        $scope.isCurrentChapter = function (chapter) {
            return $scope.current_chapter.toLowerCase() === chapter.toLowerCase();
        };
        $scope.isNotCurrentChapter = function (chapter) {
            return $scope.current_chapter.toLowerCase() !== chapter.toLowerCase();
        };
        $scope.invokeCommand = function (command) {
            CommandApi.invokeCommand(command);
        };
        $scope.isApplication = function (type) {
            return type === "apps";
        };
        $scope.isVideo = function (type) {
            return type === "videos";
        };
        $scope.isQuiz = function (type) {
            return type === "quiz";
        };

        $scope.adminPasswordDialog = function ($event) {
            var options = {
                title: "Alert",
                description: "Enter your master password",
                className: "master-password",
                callback: function(event) {
                    if(event.context.inputText !== "admin") {
                        $event.preventDefault();
                    }
                },
                type: 'input',
                placeholder: 'Enter your password'
            }
            new CustomDialog(options);
        };

        $scope.verifyPassword = function ($event) {
            //$scope.adminPasswordDialog($event);
            var password = prompt("Enter the Master Password");
            if(password == null) return false;
            if (password !== "admin") {
                $event && $event.preventDefault();
                alert("Wrong Master Password");
                return false;
            }
            return true;
        };

        $scope.uploadFile = function (data) {
            var requestJson = {
                grade: $scope.current_grade,
                subject: $scope.current_subject,
                chapter: $scope.current_chapter,
                quiz: data
            };
            $http.post('/save.php', requestJson).then(function(){
                window.location.reload();
            });
        };

        $scope.deleteQuiz = function(index) {
            if(!$scope.verifyPassword()) return;
            $http.delete('delete.php', {data: {
                grade: $scope.current_grade,
                subject: $scope.current_subject,
                chapter: $scope.current_chapter,
                name: $scope.contents[index].name
            }}).then(function() {
                window.location.reload();
            });
        }
    }]);

pencilBoxApp.controller('OtherAppController', ['$scope', 'OtherApps',
    function ($scope, OtherApps) {
        $scope.otherApps = OtherApps.query();
    }]);
pencilBoxApp.controller('SearchResultController', ['$scope', '$routeParams', 'Apps',
    function ($scope, $routeParams, Apps) {
        $scope.keyword = $routeParams.keyword;
        $scope.apps = Apps.query();
        $scope.invokeCommand = function (command) {
            CommandApi.invokeCommand(command);
        };
    }]);

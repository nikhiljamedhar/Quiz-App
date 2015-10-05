pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, CreateQuiz) {

        $scope.hasError = false;
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        CreateQuiz.query(function(response) {
            console.log("Query is Initialized");
            $scope.quizJson = { questions: response.questions };
            $scope.highlightDefault();
        });

        $scope.questionTypes =  [
            {
                "name": "Fill the blanks",
                "id": "1",
                "image": "fill-the-blanks.png",
                "type": "fill-the-blanks"
            },
            {
                "name": "Multiple options",
                "id": "2",
                "image": "multiple-options.png",
                "type": "multiple-options"
            },
            {
                "name": "Match the following",
                "id": "2",
                "image": "match-the-following.png",
                "type": "match-the-following"
            }
        ];

        $scope.showOverlay = function(element) { new Overlay(element); };

        $scope.init = function(mode) { $scope.mode = mode; };

        $scope.highlightDefault = function() {
            $scope.selectedQuestion = null;
            if($scope.mode === "create" || $scope.quizJson.questions.length === 0) {
                $scope.quizJson = { questions: [] }
                $scope.currentQuestionType = "fill-the-blanks";
                $scope.currentQuestion = $scope.getCurrentQuestionObject();
            } else {
                $scope.selectedQuestion = 0;
                $scope.currentQuestion = $scope.getCurrentQuestionObject($scope.selectedQuestion);
                $scope.currentQuestionType = $scope.currentQuestion.type;
            }
        }


        $scope.overlayLoaded = function() {
            $scope.showOverlay(document.getElementById("create-quiz-mask"));
        }

        $scope.selectQuestionType = function(type) {
            if($scope.selectedQuestion != null) {return;}
            $scope.currentQuestionType = type;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
        }

        $scope.selectQuestion = function(index) {
            $scope.selectedQuestion = index;
            $scope.currentQuestion = $scope.getCurrentQuestionObject($scope.selectedQuestion);
            $scope.currentQuestionType = $scope.currentQuestion.type;
        }

        $scope.addAnswer = function() { }

        $scope.downloadQuiz = function() { return console.log($scope.currentQuestion); }

        $scope.saveQuiz = function() {
            var isValid = false;
            if($scope.currentQuestionType === "fill-the-blanks") {
                isValid = $scope.validateFIB();
            } else if($scope.currentQuestionType === "multiple-options") {
                isValid = $scope.validateMultipleOption();
            } else if($scope.currentQuestionType === "match-the-following") {
                isValid = $scope.validateMatchTheFollowing();
            }
            if(isValid) {

            }
        }

        $scope.validateFIB = function() { return false; }

        $scope.validateMultipleOption = function() {
            console.log("validation in place");
        };

        $scope.validateMatchTheFollowing = function() { return true; }

        $scope.isCurrentSubject = function(subject) { return $scope.current_subject.toLowerCase() === subject.toLowerCase(); }

        $scope.isNotCurrentSubject = function(subject) { return $scope.current_subject.toLowerCase() !== subject.toLowerCase(); };

        $scope.isCurrentChapter = function(chapter) { return $scope.current_chapter.toLowerCase() === chapter.toLowerCase(); };


        $scope.isApplication = function(type) { return type === "apps"; };

        $scope.isVideo = function(type) { return type === "videos"; };

        $scope.isQuiz = function(type) { return type === "quiz"; };

        $scope.getCurrentQuestionObject = function(index) {
            if(typeof index != "undefined") { return $scope.quizJson.questions[index]; }
            if($scope.currentQuestionType === "fill-the-blanks") {
                return $scope.getFIBQuestion();
            } else if($scope.currentQuestionType === "multiple-options") {
                return $scope.getMultipleOption();
            } else if($scope.currentQuestionType === "match-the-following") {
                return $scope.getMatchTheFollowing();
            }
        };

        $scope.getFIBQuestion = function() {

            return  {
                "type": "fill-the-blanks",
                "sentence": "",
                "question": []
            }

        };

        $scope.getMultipleOption = function() {

            return {
                "type": "multiple-options",
                "question": "",
                "options": [{"id": 1, "value": ""}, {"id": 2, "value": ""}, {"id": 3, "value": ""}, {"id": 4, "value": ""}],
                "answer": []
            }

        };

        $scope.getMatchTheFollowing = function() {

            return  {
                "type": "match-the-following",
                "questions": [{"question": "", "answer": ""}]
            }

        };

        $scope.addRow = function() {
            if($scope.currentQuestion.questions.length < 10) {
                $scope.currentQuestion.questions.push({"question": "", "answer": ""});
            }
        }
        $scope.deleteRow = function(index) {
            $scope.currentQuestion.questions.splice(index, 1);
        }

        $scope.addQuestion = function() {
            if($scope.hasError()) { alert("Please fill the red field"); return; }

            if($scope.selectedQuestion == null) {
                $scope.quizJson.questions.push(angular.copy($scope.currentQuestion));
            }

            $scope.selectedQuestion = null;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
        }

        $scope.hasError = function() {
            return document.querySelectorAll(".question-box .error").length > 0;
        }

        $scope.addBlank = function(questionNo) {
            var answer = prompt("Enter the answer for blank:", '');
            if(!answer || !answer.trim()) return;
            var caretPosition = document.getElementById('fill-in-the-blank-question').selectionStart;
            var insertAt = function(mainString, insertString, index) {
                var leftPart = mainString.substr(0, index);
                var rightPart = mainString.substr(index, mainString.length);
                return leftPart + insertString + rightPart;
            };
            $scope.currentQuestion.question = insertAt($scope.currentQuestion.question, '__' + answer + '__', caretPosition);
        };

        $scope.fillInTheBlankPreview = function() {
            return $scope.currentQuestion.question.replace(/__.*?__/g, '_______');
        };
        $scope.download = function() {

            var json = JSON.stringify($scope.quizJson);
            var blob = new Blob([json], {type: "application/json"});
            var url  = URL.createObjectURL(blob);

            //var a = document.createElement('a');
            //a.download    = "backup.json";
            //a.href        = url;
            //a.textContent = "Download backup.json";
            //
            //document.getElementById('content').appendChild(a);


            window.URL.revokeObjectURL(url);
        }
    }
]).directive("multipleCheckboxGroup", function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            if (scope.currentQuestion.answer.indexOf(scope.option.id) !== -1) {
                element[0].checked = true;
            }

            element.bind('click', function() {
                var index = scope.currentQuestion.answer.indexOf(scope.option.id);
                if (element[0].checked) {
                    if (index === -1) scope.currentQuestion.answer.push(scope.option.id);
                } else {
                    if (index !== -1) scope.currentQuestion.answer.splice(index, 1);
                }
                scope.$apply(scope.currentQuestion.answer.sort(function(a, b) {
                    return a - b
                }));
            });
        }
    }
});

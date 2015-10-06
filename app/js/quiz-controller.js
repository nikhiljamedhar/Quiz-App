pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, CreateQuiz) {

        $scope.hasChange = false;
        $scope.hasError = false;
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        CreateQuiz.query(function(response) {
            console.log("Query is Initialized");
            $scope.quizJson = { questions: response.questions };
            $scope.highlightDefault();
        });

        $scope.init = function(mode) { $scope.mode = mode; };

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

        $scope.showOverlay = function(element) {
            $scope.overlay = new Overlay(element, {closeHandler: true});
        };

        $scope.closeOverlay = function($event) {
            if($scope.hasChange) {
                $event.preventDefault();
                var r = confirm("You have unsaved changes in the quiz. Do you want to download it?");
                if (r == false) {
                    $scope.overlay.disposeOverlay();
                    var url = window.location.href;
                    url = url.replace("update-quiz/", "")
                    url = url.replace("create-quiz/", "")
                    window.location.href = url.replace("update-quiz/", "");
                }
            }
        }



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
                "question": ""
            }

        };

        $scope.getMultipleOption = function() {

            return {
                "type": "multiple-options",
                "question": "",
                "options": [{"value": ""}, {"value": ""}],
                "answer": []
            }

        };

        $scope.getMatchTheFollowing = function() {

            return  {
                "type": "match-the-following",
                "questions": [{"question": "", "answer": ""}, {"question": "", "answer": ""}]
            }

        };

        $scope.addRow = function() {
            if($scope.currentQuestionType === "multiple-options") {
                if($scope.currentQuestion.options.length < 5) {
                    $scope.currentQuestion.options.push({"value": ""});
                    console.log("add", $scope.currentQuestion, $scope.currentQuestion.options.length)
                }
            } else {
                if($scope.currentQuestion.questions.length < 10) {
                    $scope.currentQuestion.questions.push({"question": "", "answer": ""});
                }
            }
        }
        $scope.deleteRow = function(index) {
            if($scope.currentQuestionType === "multiple-options") {
                if($scope.currentQuestion.options.length > 2) {
                    $scope.currentQuestion.options.splice(index, 1);
                    var ansPosition = $scope.currentQuestion.answer.indexOf(index);
                    if(ansPosition != -1) {
                        $scope.currentQuestion.answer.splice(ansPosition, 1);
                    }
                }
            } else {
                if($scope.currentQuestion.questions.length > 2) { $scope.currentQuestion.questions.splice(index, 1); }
            }

        }

        $scope.addQuestion = function() {
            if($scope.hasError()) { alert("Please fill the red field"); return; }

            if($scope.selectedQuestion == null) {
                $scope.quizJson.questions.push(angular.copy($scope.currentQuestion));
            }

            $scope.selectedQuestion = null;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
            $scope.hasChange = true;
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
            return $scope.currentQuestion.question ? $scope.currentQuestion.question.replace(/__.*?__/g, '_______') : "";
        };
        $scope.download = function() {
            document.getElementById("download-json").href = window.URL.createObjectURL(new Blob([JSON.stringify($scope.quizJson)], {type: "application/json"}));
        }
    }
]).directive("multipleCheckboxGroup", function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            setTimeout(function() {
                var value = parseInt(element[0].dataset.index);
                if (scope.currentQuestion.answer.indexOf(value) !== -1) {
                    element[0].checked = true;
                }
            }, 200)

            element.bind('click', function() {
                var value = parseInt(element[0].dataset.index);
                var index = scope.currentQuestion.answer.indexOf(value);
                if (element[0].checked) {
                    if (index === -1) scope.currentQuestion.answer.push(value);
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

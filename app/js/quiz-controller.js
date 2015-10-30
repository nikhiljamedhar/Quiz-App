pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', '$http', '$q',
    function ($scope, $routeParams, CreateQuiz, $http, $q) {
        $scope.hasChange = false;
        $scope.hasError = false;
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        $scope.questionTypes = {
            "fill-the-blanks": {
                "name": "Fill the blanks",
                "image": "fill-the-blanks.png",
                "type": "fill-the-blanks",
                defaultQuestion: {
                    "type": "fill-the-blanks",
                    "question": "",
                    "questionCollection": [],
                    "marks": 1
                }
            },
            "multiple-options": {
                "name": "Multiple options",
                "image": "multiple-options.png",
                "type": "multiple-options",
                defaultQuestion: {
                    "marks": 1,
                    "type": "multiple-options",
                    "question": "",
                    "options": [
                        {
                            "value": "",
                            "answer": false
                        },
                        {
                            "value": "",
                            "answer": false
                        }
                    ]
                }
            },
            "match-the-following": {
                "name": "Match the following",
                "image": "match-the-following.png",
                "type": "match-the-following",
                defaultQuestion: {
                    "marks": 1,
                    "type": "match-the-following",
                    "questions": [
                        {
                            "question": "",
                            "answer": ""
                        },
                        {
                            "question": "",
                            "answer": ""
                        }
                    ]
                }
            }
        };

        var getDefaultQuestion = function (type) {
            return angular.copy($scope.questionTypes[type].defaultQuestion);
        };

        $scope.quizJson = {questions: [getDefaultQuestion('fill-the-blanks')]};
        $scope.currentQuestionIndex = 0;


        $scope.showOverlay = function (element) {
            $scope.overlay = new Overlay(element, {closeHandler: true});
        };

        $scope.closeOverlay = function ($event) {
            if ($scope.hasChange) {
                $event.preventDefault();
                var r = confirm("You have unsaved changes in the quiz. Do you want to save it?");
                if (r) return;
            }

            $scope.overlay.disposeOverlay();
            var url = window.location.href;
            url = url.replace("update-quiz/", "");
            url = url.replace("create-quiz/", "");
            window.location.href = url.replace("update-quiz/", "");
        };

        $scope.overlayLoaded = function () {
            $scope.showOverlay(document.getElementById("create-quiz-mask"));
        };

        $scope.getCurrentQuestionObject = function (index) {
            if (typeof index != "undefined") {
                return $scope.quizJson.questions[index];
            }
            return getDefaultQuestion($scope.currentQuestion.type);
        };

        $scope.addRow = function () {
            if ($scope.currentQuestion.type === "multiple-options") {
                if ($scope.currentQuestion.options.length < 5) {
                    $scope.currentQuestion.options.push({"value": "", "answer": false});
                } else {
                    var options = {
                        title: "Alert",
                        description: "Cannot add more than 5 options",
                        buttons: ["ok"]
                    };
                    new CustomDialog($q, options);
                }
            } else {
                if ($scope.currentQuestion.questions.length < 10) {
                    $scope.currentQuestion.questions.push({"question": "", "answer": ""});
                } else {
                    options = {
                        title: "Alert",
                        description: "Cannot add more than 10 options",
                        buttons: ["ok"]
                    };
                    new CustomDialog($q, options);
                }
            }
            $scope.isValidMultipleOption();
        };
        $scope.deleteRow = function (index) {
            var key = $scope.currentQuestion.type === "multiple-options" ? "options" : "questions";
            if ($scope.currentQuestion[key].length > 2) {
                $scope.currentQuestion[key].splice(index, 1);
            }
            $scope.isValidMultipleOption();
        };

        $scope.saveQuestion = function () {
            if ($scope.hasError()) {
                var options = {
                    title: "Alert",
                    description: "Please fill the red field",
                    buttons: ["ok"]
                };
                new CustomDialog($q, options);
                return false;
            }

            if ($scope.currentQuestion.type === "fill-the-blanks") {
                // Converting into question collection

                var splits = $scope.currentQuestion.question.split('__');
                $scope.currentQuestion.questionCollection = splits.map(function (el, i) {
                    if (i % 2 == 0) {
                        return {type: "question", value: el.trim()};
                    } else {
                        return {type: "answer", value: el.trim()};
                    }
                });
            }

            $scope.currentQuestionIndex = $scope.quizJson.questions.length - 1;
            return true;
        };

        var refreshCurrentQuestion = function () {
            $scope.currentQuestion = $scope.quizJson.questions[$scope.currentQuestionIndex];
        };
        $scope.$watch('currentQuestionIndex', refreshCurrentQuestion);

        $scope.addQuestion = function () {
            //if(!$scope.saveQuestion()) return;
            $scope.quizJson.questions.push($scope.getCurrentQuestionObject());
            $scope.currentQuestionIndex = $scope.quizJson.questions.length - 1;
            $scope.isValidMultipleOption();
        };

        $scope.hasError = function () {
            return document.querySelectorAll(".question-box .error, .question-box .ng-invalid").length > 0;
        };

        $scope.selectQuestion = function(index) {
            $scope.currentQuestionIndex = index;
        };

        $scope.addBlank = function () {
            var answer = prompt("Enter the answer for blank:", '');
            if (!answer || !answer.trim()) return;
            var caretPosition = document.getElementById('fill-in-the-blank-question').selectionStart;
            var insertAt = function (mainString, insertString, index) {
                var leftPart = mainString.substr(0, index);
                var rightPart = mainString.substr(index, mainString.length);
                return leftPart + insertString + rightPart;
            };
            $scope.currentQuestion.question = insertAt($scope.currentQuestion.question, '__' + answer + '__', caretPosition);
        };

        $scope.fillInTheBlankPreview = function () {
            if (!$scope.currentQuestion) return '';
            return $scope.currentQuestion.question ? $scope.currentQuestion.question.replace(/__.*?__/g, '_______') : "";
        };

        $scope.previousQuestion = function () {
            $scope.currentQuestionIndex = Math.min(0, $scope.currentQuestionIndex - 1);
        };
        $scope.nextQuestion = function () {
            $scope.currentQuestionIndex = Math.max($scope.quizJson.questions.length - 1, $scope.currentQuestionIndex + 1);
        };

        $scope.isValidMultipleOption = function () {
            if ($scope.currentQuestion.type === "multiple-options") {
                $scope.mcHasError = true;
                for (var i = 0, length = $scope.currentQuestion.options.length; i < length; i++) {
                    if ($scope.currentQuestion.options[i].answer) {
                        $scope.mcHasError = false;
                        break;
                    }
                }
            }
        };

        $scope.canDeleteQuestion = function() {
            return $scope.quizJson.questions.length > 1;
        };
        $scope.deleteQuestion = function () {
            if(!$scope.canDeleteQuestion()) return;
            var dialogInstance = new CustomDialog($q, {
                title: "Alert",
                description: "Are you sure you want to delete this question?",
                buttons: ["ok", "cancel"]
            }).show();
            dialogInstance
                    .then(function () {
                        $scope.quizJson.questions.splice($scope.currentQuestionIndex, 1);
                        if($scope.currentQuestionIndex > $scope.quizJson.questions.length - 1) {
                            $scope.currentQuestionIndex = $scope.quizJson.questions.length - 1;
                        } else {
                            refreshCurrentQuestion();
                        }
                    })
                    .catch(function (e) {
                    });
        };

        $scope.isExistingQuestion = function () {
            return $scope.currentQuestionIndex;
        };

        $scope.errorsForQuestion = function (question) {
            var msg = '';
            if (question.type === "fill-the-blanks") {
                msg = question.question.trim().length === 0 ? "Please fill the question" : !question.question.trim().match(/__[^_]+__/) ? "Please provide answer" : "";
            } else if (question.type === "match-the-following") {
                msg = "Please fill the questions and answers";
            } else {
                msg = question.question.trim().length === 0 ? "Please fill the question" :
                        question.question.trim().length < 10 ? "Please provide atleast 10 characters" :
                                question.options.map(function (item) {
                                    return item.value.trim() === ""
                                }) ? "Please fill the answer options" :
                                        question.options.map(function (item) {
                                            return item.answer === false
                                        }) ? "Please set answer to the question" : "";
            }
            return msg;
        };

        $scope.saveQuiz = function () {
            var error = "";
            if (!$scope.quizJson.name) {
                error = "Please give a name to the Quiz";
            } else {
                var firstInvalidQuestionIndex = $scope.quizJson.questions.findIndex(function(question) {
                    return $scope.errorsForQuestion(question) != '';
                });

                if(firstInvalidQuestionIndex !== undefined) {
                    $scope.currentQuestionIndex = firstInvalidQuestionIndex;
                    error = $scope.errorsForQuestion($scope.quizJson.questions[firstInvalidQuestionIndex])
                }
            }
            if (error) {
                var options = {
                    title: "Alert",
                    description: error || "Please fill the red field",
                    buttons: ["ok"]
                };
                new CustomDialog($q, options);
            } else {
                var data = {
                    grade: $scope.current_grade,
                    subject: $scope.current_subject,
                    chapter: $scope.current_chapter,
                    quiz: $scope.quizJson
                };
                $http.post('/save.php', data, {headers: {'Content-Type': 'application/json'}}).
                        then(function () {
                            $scope.hasChange = false;
                            $scope.closeOverlay({
                                preventDefault: function () {
                                }
                            });
                            var options = {
                                title: "Success",
                                description: "Successfully saved the quiz.",
                                buttons: ["ok"]
                            };
                            new CustomDialog($q, options);
                        }, function () {
                            console.log(arguments);
                        });
            }
        };

        $scope.validateInput = function (obj, limit) {
            if (obj.length >= limit) {
                var options = {
                    title: "Alert",
                    description: "You cannot add more than " + limit + " characters",
                    buttons: ["ok"]
                };
                new CustomDialog($q, options);
            }
        };

        $scope.setQuestionType = function (questionType) {
            var setType = function () {
                $scope.currentQuestion = $scope.quizJson.questions[$scope.currentQuestionIndex] = getDefaultQuestion(questionType);
            };
            if($scope.currentQuestion.question) {
                new CustomDialog($q, {
                    title: "Confirm",
                    description: "You have entered some question details. If you change the type, they'll be lost. Are you sure, you want to change the type?",
                    buttons: ["ok", "cancel"]
                }).show().then(setType);
            } else {
                setType();
            }
        }
    }

]);

pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', '$http', '$q',
    function ($scope, $routeParams, CreateQuiz, $http, $q) {
        $scope.hasChange = false;
        $scope.hasError = false;
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        CreateQuiz.query(function (response) {
            console.log("Query is Initialized");
            $scope.quizJson = {questions: response.questions};
            $scope.highlightDefault();
        });

        $scope.init = function (mode) {
            $scope.mode = mode;
        };

        $scope.questionTypes = [
            {
                "name": "Fill the blanks",
                "image": "fill-the-blanks.png",
                "type": "fill-the-blanks"
            },
            {
                "name": "Multiple options",
                "image": "multiple-options.png",
                "type": "multiple-options"
            },
            {
                "name": "Match the following",
                "image": "match-the-following.png",
                "type": "match-the-following"
            }
        ];

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


        $scope.highlightDefault = function () {
            $scope.selectedQuestion = null;
            if ($scope.mode === "create" || $scope.quizJson.questions.length === 0) {
                $scope.quizJson = {questions: []}
                $scope.currentQuestionType = "fill-the-blanks";
                $scope.currentQuestion = $scope.getCurrentQuestionObject();
            } else {
                $scope.selectedQuestion = 0;
                $scope.currentQuestion = $scope.getCurrentQuestionObject($scope.selectedQuestion);
                $scope.currentQuestionType = $scope.currentQuestion.type;
            }
        }


        $scope.overlayLoaded = function () {
            $scope.showOverlay(document.getElementById("create-quiz-mask"));
        }

        $scope.selectQuestionType = function (type) {
            if ($scope.selectedQuestion != null) {
                return;
            }
            $scope.currentQuestionType = type;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
            $scope.isValidMultipleOption();
        }

        $scope.selectQuestion = function (index) {
            $scope.selectedQuestion = index;
            $scope.currentQuestion = $scope.getCurrentQuestionObject($scope.selectedQuestion);
            $scope.currentQuestionType = $scope.currentQuestion.type;
            $scope.isValidMultipleOption();
        }

        $scope.isCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() === subject.toLowerCase();
        }

        $scope.isNotCurrentSubject = function (subject) {
            return $scope.current_subject.toLowerCase() !== subject.toLowerCase();
        };

        $scope.isCurrentChapter = function (chapter) {
            return $scope.current_chapter.toLowerCase() === chapter.toLowerCase();
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

        $scope.getCurrentQuestionObject = function (index) {
            if (typeof index != "undefined") {
                return $scope.quizJson.questions[index];
            }
            if ($scope.currentQuestionType === "fill-the-blanks") {
                return $scope.getFIBQuestion();
            } else if ($scope.currentQuestionType === "multiple-options") {
                return $scope.getMultipleOption();
            } else if ($scope.currentQuestionType === "match-the-following") {
                return $scope.getMatchTheFollowing();
            }
        };

        $scope.getFIBQuestion = function () {

            return {
                "type": "fill-the-blanks",
                "question": "",
                "questionCollection": [],
                "marks": 1
            }

        };

        $scope.getMultipleOption = function () {

            return {
                "type": "multiple-options",
                "question": "",
                "options": [{"value": "", "answer": false}, {"value": "", "answer": false}],
                "marks": 1
            }

        };

        $scope.getMatchTheFollowing = function () {

            return {
                "type": "match-the-following",
                "questions": [{"question": "", "answer": ""}, {"question": "", "answer": ""}, {
                    "question": "",
                    "answer": ""
                }],
                "marks": 1
            }

        };

        $scope.addRow = function () {
            if ($scope.currentQuestionType === "multiple-options") {
                if ($scope.currentQuestion.options.length < 5) {
                    $scope.currentQuestion.options.push({"value": "", "answer": false});
                } else {
                    var options = {
                        title: "Alert",
                        description: "Cannot add more than 5 options",
                        buttons: ["ok"]
                    }
                    new CustomDialog(options);
                }
            } else {
                if ($scope.currentQuestion.questions.length < 10) {
                    $scope.currentQuestion.questions.push({"question": "", "answer": ""});
                } else {
                    var options = {
                        title: "Alert",
                        description: "Cannot add more than 10 options",
                        buttons: ["ok"]
                    }
                    new CustomDialog(options);
                }
            }
            $scope.isValidMultipleOption();
        }
        $scope.deleteRow = function (index) {
            var key = $scope.currentQuestionType === "multiple-options" ? "options" : "questions";
            if ($scope.currentQuestion[key].length > 2) {
                $scope.currentQuestion[key].splice(index, 1);
            }
            $scope.isValidMultipleOption();
        }

        $scope.addQuestion = function () {
            if ($scope.hasError()) {
                var options = {
                    title: "Alert",
                    description: "Please fill the red field",
                    buttons: ["ok"]
                }
                new CustomDialog(options);
                return;
            }

            if ($scope.currentQuestionType === "fill-the-blanks") {
                // Converting into question collection

                var questArr = $scope.currentQuestion.question.replace(/__.*?__/g, '_______').split(" ");
                var answerArr = $scope.currentQuestion.question.match(/__.*?__/g).join("").split("_").filter(Boolean);

                for (var i = 0, length = questArr.length; i < length; i++) {
                    if (questArr[i] === "_______") {
                        $scope.currentQuestion.questionCollection.push({type: "answer", value: answerArr.shift()});
                    } else if (questArr[i].trim().length > 0) {
                        $scope.currentQuestion.questionCollection.push({type: "question", value: questArr[i].trim()});
                    }
                }
            }


            if ($scope.selectedQuestion == null) {
                $scope.quizJson.questions.push(angular.copy($scope.currentQuestion));
            }

            $scope.selectedQuestion = null;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
            $scope.hasChange = true;
            $scope.isValidMultipleOption();
        }

        $scope.hasError = function () {
            return document.querySelectorAll(".question-box .error, .question-box .ng-invalid").length > 0;
        }

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
        $scope.download = function () {
            document.getElementById("download-json").href = window.URL.createObjectURL(new Blob([JSON.stringify($scope.quizJson)], {type: "application/json"}));
        };

        $scope.isFirstQuestion = function () {
            return $scope.quizJson.questions.indexOf($scope.currentQuestion) <= 0;
        };

        $scope.previousQuestion = function () {
            var index = $scope.selectedQuestion;
            if ($scope.selectedQuestion == null) {
                index = 0;
            } else {
                if ($scope.selectedQuestion !== 0) {
                    index = $scope.selectedQuestion - 1;
                }
            }
            $scope.selectQuestion(index);
        };
        $scope.nextQuestion = function () {
            var index = $scope.selectedQuestion;
            if ($scope.selectedQuestion == null) {
                index = $scope.quizJson.questions.length - 1;
            } else {
                if ($scope.selectedQuestion !== $scope.quizJson.questions.length - 1) {
                    index = $scope.selectedQuestion + 1;
                }
            }
            $scope.selectQuestion(index);
        };

        $scope.isValidMultipleOption = function () {
            if ($scope.currentQuestionType === "multiple-options") {
                $scope.mcHasError = true;
                for (var i = 0, length = $scope.currentQuestion.options.length; i < length; i++) {
                    if ($scope.currentQuestion.options[i].answer) {
                        $scope.mcHasError = false;
                        break;
                    }
                }
            }
        };

        $scope.cancelQuestion = function () {
            console.log('here');
            var dialogInstance = new CustomDialog($q, {
                title: "Alert",
                description: "Are you sure you want to delete this question?",
                buttons: ["ok", "cancel"]
            }).show();
            dialogInstance
                    .then(function (result) {
                        $scope.quizJson.questions.splice($scope.selectedQuestion, 1);
                    })
                    .catch(function (e) {
                    });
            $scope.selectQuestion();
        };

        $scope.isExistingQuestion = function () {
            return $scope.selectedQuestion;
        };

        $scope.getErrorMessage = function () {
            var msg = "";
            if ($scope.currentQuestionType === "fill-the-blanks") {
                msg = $scope.currentQuestion.question.trim().length === 0 ? "Please fill the question" : !$scope.currentQuestion.question.trim().match(/__[^_]+__/) ? "Please provide answer" : "";
            } else if ($scope.currentQuestionType === "match-the-following") {
                msg = "Please fill the questions and answers";
            } else {
                msg = $scope.currentQuestion.question.trim().length === 0 ? "Please fill the question" :
                        $scope.currentQuestion.question.trim().length < 10 ? "Please provide atleast 10 characters" :
                                $scope.currentQuestion.options.map(function (item) {
                                    return item.value.trim() === ""
                                }) ? "Please fill the answer options" :
                                        $scope.currentQuestion.options.map(function (item) {
                                            return item.answer === false
                                        }) ? "Please set answer to the question" : "";
            }
            return msg;
        }

        $scope.saveQuiz = function () {
            if ($scope.hasError()) {
                var errorMsg = $scope.getErrorMessage();
                var options = {
                    title: "Alert",
                    description: errorMsg || "Please fill the red field",
                    buttons: ["ok"]
                }
                new CustomDialog(options);
            } else {
                var data = {
                    grade: $scope.current_grade,
                    subject: $scope.current_subject,
                    chapter: $scope.current_chapter,
                    quiz: $scope.quizJson
                };
                $http.post('/save.php', data, {headers: {'Content-Type': 'application/json'}}).
                        then(function (response) {
                            $scope.hasChange = false;
                            $scope.closeOverlay({
                                preventDefault: function () {
                                }
                            })
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
                }
                new CustomDialog(options);
            }
        }
    }

]);
